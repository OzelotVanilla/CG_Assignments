#version 300 es
precision mediump float;

const vec4 center_colour = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 outer_colour = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 viewport_center = vec2(0.5, 0.5);
in vec2 coord;
out vec4 colour_out;

void main()
{
    float distance_to_center = distance(coord, viewport_center);
    float intensity = exp(-4.0 * distance_to_center); // `* 4.0` to make outer colour black.
    colour_out = mix(outer_colour, center_colour, intensity);
}