import { onRockRamielConstructor } from './rock_ramiel';
import { createProgram } from '../../lib/gl';


/**
 * Altitude of the ground.
 * Given the ramiel's center altitude is `0`.
 */
const ground_altitude = -4

/**
 * Length of the ground square.
 */
const ground_length = 100


enum ObjectDrawnID
{
    ground = 0,
    ramiel_upper = 10,
    ramiel_lower,
    ramiel_laser,
}


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

    const button__ref = document.getElementById("rock_ramiel") as HTMLButtonElement
    button__ref.addEventListener("click", onRockRamielConstructor(gl, program))
}

function setupShader(gl: WebGL2RenderingContext, program: WebGLProgram)
{
    // // Prepare vertices to draw. Remember they use Y-axis for the up/down-axis.
    const upper_square_pyramid_vertices = [
        0, 1, 0, // top
        1, 0, 1, // ground 1
        0, 1, 0, // top
        -1, 0, 1, // ground 2
        0, 1, 0, // top
        -1, 0, -1, // ground 3
        0, 1, 0, // top
        1, 0, -1, // ground 4
        1, 0, 1, // ground 1
    ]
    const lower_square_pyramid_vertices = [
        0, -1, 0, // top
        1, 0, 1, // ground 1
        0, -1, 0, // top
        -1, 0, 1, // ground 2
        0, -1, 0, // top
        -1, 0, -1, // ground 3
        0, -1, 0, // top
        1, 0, -1, // ground 4
        1, 0, 1, // ground 1
    ]
    const groud_vertices = [
        -ground_length, ground_altitude, ground_length,
        ground_length, ground_altitude, ground_length,
        -ground_length, ground_altitude, -ground_length,
        ground_length, ground_altitude, -ground_length
    ]

    // // Create vertex buffer objects (VBOs).
    // Upper part.
    let upper_square_pyramid_vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, upper_square_pyramid_vbo) // Next, operate this buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(upper_square_pyramid_vertices), // into `upper_square_pyramid_vbo`
        gl.STATIC_DRAW
    )
    // Lower part.
    let lower_square_pyramid_vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, lower_square_pyramid_vbo) // Next, operate this buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(lower_square_pyramid_vertices), // into `lower_square_pyramid_vbo`
        gl.STATIC_DRAW
    )
    // Ground part.
    let ground_vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, ground_vbo) // Next, operate this buffer.
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(groud_vertices), // into `ground_vbo`
        gl.STATIC_DRAW
    )

    // // Retrieve/Init in/uniform param location/settings.
    const vertex_shader_attr_pos__position = gl.getAttribLocation(program, "position")
    const vertex_shader_uniform_pos__time = gl.getUniformLocation(program, "time")
    const vertex_shader_uniform_pos__id_of_object = gl.getUniformLocation(program, "id_of_object_vertex")
    gl.enableVertexAttribArray(vertex_shader_attr_pos__position) // let `position` read from coming VBO buffers
    // // Define shader frame action.
    function performShaderFrameAction(time: DOMHighResTimeStamp)
    {
        // // Clear old.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // // Give new time parameter.
        gl.uniform1f(vertex_shader_uniform_pos__time, time / 1000) // `time`: ms to s.

        // // Draw Upper Square Pyramid.
        // Provide data to vertex shader.
        gl.bindBuffer(gl.ARRAY_BUFFER, upper_square_pyramid_vbo) // Set operating buffer to be `upper_square_pyramid_vbo`
        gl.vertexAttribPointer(vertex_shader_attr_pos__position, 3, gl.FLOAT, false, 0, 0) // Set how `position` read from `upper_square_pyramid_vbo`
        gl.uniform1i(vertex_shader_uniform_pos__id_of_object, ObjectDrawnID.ramiel_upper)
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 9)

        // // Draw Lower Square Pyramid.
        // Provide data to vertex shader.
        gl.bindBuffer(gl.ARRAY_BUFFER, lower_square_pyramid_vbo) // Set operating buffer to be `lower_square_pyramid_vbo`
        gl.vertexAttribPointer(vertex_shader_attr_pos__position, 3, gl.FLOAT, false, 0, 0) // Set how `position` read from `lower_square_pyramid_vbo`
        gl.uniform1i(vertex_shader_uniform_pos__id_of_object, ObjectDrawnID.ramiel_lower)
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 9)

        // // Draw Ground.
        // Provide data to vertex shader.
        gl.bindBuffer(gl.ARRAY_BUFFER, ground_vbo) // Set operating buffer to be `ground_vbo`
        gl.vertexAttribPointer(vertex_shader_attr_pos__position, 3, gl.FLOAT, false, 0, 0) // Set how `position` read from `ground_vbo`
        gl.uniform1i(vertex_shader_uniform_pos__id_of_object, ObjectDrawnID.ground)
        // Draw.
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

        // // Request next frame.
        requestAnimationFrame(performShaderFrameAction)
    }

    // // Init shader settings.
    // Set the colour to fill when cleaning the buffer.
    gl.clearColor(0.627, 0.847, 0.937, 1.0) // #a0d8ef
    // Enable depth test.
    gl.enable(gl.DEPTH_TEST)

    // // Finally draw things.
    requestAnimationFrame(performShaderFrameAction)
}

init()