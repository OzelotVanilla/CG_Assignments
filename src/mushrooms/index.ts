import { createProgram } from '../../lib/gl';


function init()
{
    const canvas__ref = document.getElementById("gl_canvas") as HTMLCanvasElement | null
    if (canvas__ref == null)
    {
        throw EvalError(`No canvas with id \`gl_canvas\` found.`)
    }
    const gl = canvas__ref.getContext("webgl2")
    if (gl == null)
    {
        throw Error(`WebGL2 not supported.`)
    }

    const vertex__src_text = document.getElementById("vertex_shader")!.textContent!.trim();
    const fragment__src_text = document.getElementById("fragment_shader")!.textContent!.trim();

    const program = createProgram(gl, vertex__src_text, fragment__src_text)
    gl.useProgram(program)

    setupShader(gl, program)
}

function setupShader(gl: WebGL2RenderingContext, program: WebGLProgram)
{
    // // Prepare vertices to draw a square on the screen, so GPU can allows shader to work.
    let vertices = [
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,  
    ]

    let vertex_pos_buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_pos_buffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    )

    // // // Provide data to vertex shader.
    const vertex_shader_attr_pos__position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(vertex_shader_attr_pos__position) // let `position` read from buffer `vertices`
    gl.vertexAttribPointer(vertex_shader_attr_pos__position, 2, gl.FLOAT, false, 0, 0) // how to read

    // // Retrieve uniform param location.
    const fragment_shader_uniform_pos__resolution = gl.getUniformLocation(program, "u_resolution");
    const fragment_shader_uniform_pos__mouse_position = gl.getUniformLocation(program, "u_mouse");
    const fragment_shader_uniform_pos__time = gl.getUniformLocation(program, "u_time");

    // // Simulate `u_` uniform, code adopted from: https://github.com/patriciogonzalezvivo/glslCanvas/
    const time_loaded = performance.now()
    const canvas__ref = document.getElementById("gl_canvas")! as HTMLCanvasElement
    let mouse_original = { x: 0, y: 0 }
    /** Pixel position in canvas. */
    let mouse_pixel_pos = { x: 0, y: 0 }
    document.addEventListener("mousemove", (e) => { mouse_original.x = e.clientX || e.pageX; mouse_original.y = e.clientY || e.pageY; }, false);
    function updateMouseNormedXYIfPossible()
    {
        let rect = canvas__ref.getBoundingClientRect();
        // If mouse inside.
        if (mouse_original.x && mouse_original.x >= rect.left && mouse_original.x <= rect.right &&
            mouse_original.y && mouse_original.y >= rect.top && mouse_original.y <= rect.bottom)
        {
            mouse_pixel_pos = {
                x: (mouse_original.x - rect.left) * canvas__ref.width / rect.width,
                y: (rect.bottom - mouse_original.y) * canvas__ref.height / rect.height
            }
        }
    }
    // // Define shader frame action.
    function performShaderFrameAction(time: DOMHighResTimeStamp)
    {
        // // Clear old.
        gl.clear(gl.COLOR_BUFFER_BIT)

        // // Simulate those `u_` uniform.
        updateMouseNormedXYIfPossible()
        gl.uniform2f(fragment_shader_uniform_pos__mouse_position, mouse_pixel_pos.x, mouse_pixel_pos.y)
        gl.uniform2f(fragment_shader_uniform_pos__resolution, canvas__ref.width, canvas__ref.height)
        gl.uniform1f(fragment_shader_uniform_pos__time, (time - time_loaded) / 1000.0)

        // // Draw and request
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        requestAnimationFrame(performShaderFrameAction)
    }

    // // Clear canvas param setting.
    gl.clearColor(0, 0, 0, 0)

    // // Finally draw things.
    requestAnimationFrame(performShaderFrameAction)
}

init()