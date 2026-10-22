// import vertex__src_text from './vertex.glsl?raw';
// import fragment__src_text from './fragment.glsl?raw';
import { createProgram } from '../../../lib/gl';

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

    // // Provide data to vertex shader.
    const vertex_shader_attr_pos__position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(vertex_shader_attr_pos__position) // let `position` read from buffer `vertices`
    gl.vertexAttribPointer(vertex_shader_attr_pos__position, 2, gl.FLOAT, false, 0, 0) // how to read

    // // Clear canvas (why ? it is clean).
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // // Finally draw things.
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

init()