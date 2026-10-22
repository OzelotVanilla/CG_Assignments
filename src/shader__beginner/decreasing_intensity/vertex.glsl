#version 300 es
in vec4 position;
out vec2 coord; // for viewport

void main()
{
    coord = position.xy * 0.5 + 0.5;
    gl_Position = position;
}