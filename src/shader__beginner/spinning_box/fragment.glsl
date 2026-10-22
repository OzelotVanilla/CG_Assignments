#version 300 es
precision mediump float;

const vec4 square_colour = vec4(0.871, 0.792, 0.996, 1.0);
const vec4 transparent = vec4(0.0);

in vec2 coord;
out vec4 colour_out;

void main()
{
    bool is_inside_square = abs(coord.x - 0.5) < 0.25 && abs(coord.y - 0.5) < 0.25;
    colour_out = is_inside_square ? square_colour : transparent;
}