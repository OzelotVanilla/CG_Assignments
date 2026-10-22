/**
 * Adopted from https://esslab.jp/~ess/en/teaching/2021/acg/notes/03_webgl/
 */
export function createProgram(gl: WebGL2RenderingContext, vertex_src_text: string, fragment_src_text: string)
{
    let vshd = gl.createShader(gl.VERTEX_SHADER);
    if (vshd == null)
    {
        throw Error("`createProgram`: Cannot create vertex shader.")
    }
    gl.shaderSource(vshd, vertex_src_text);
    gl.compileShader(vshd);
    if (!gl.getShaderParameter(vshd, gl.COMPILE_STATUS))
    {
        throw new Error("`createProgram`: Unable to compile vertex shader: " + gl.getShaderInfoLog(vshd));
    }

    let fshd = gl.createShader(gl.FRAGMENT_SHADER);
    if (fshd == null)
    {
        throw Error("`createProgram`: Cannot create fragment shader.")
    }
    gl.shaderSource(fshd, fragment_src_text);
    gl.compileShader(fshd);
    if (!gl.getShaderParameter(fshd, gl.COMPILE_STATUS))
    {
        throw new Error("`createProgram`: Unable to compile fragment shader: " + gl.getShaderInfoLog(fshd));
    }

    let prog = gl.createProgram();
    gl.attachShader(prog, vshd);
    gl.attachShader(prog, fshd);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    {
        throw new Error("`createProgram`: Unable to link program: " + gl.getProgramInfoLog(prog));
    }

    return prog;
}