#version 300 es
in vec2 position; // vertex position
out vec2 coord; // for viewport

void main()
{
    coord = position.xy * 0.5 + 0.5 ;
    gl_Position = vec4(position, 0.0, 1.0) ;
}