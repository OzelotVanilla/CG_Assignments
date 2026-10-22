#version 300 es
in vec4 position; // vertex position
out vec2 coord; // for viewport

uniform float angle;

const vec2 offset_from_center = vec2(0.2, 0.2);
const mat3 transform_move_off_center = mat3(1, 0, 0, 0, 1, 0, offset_from_center, 1);

void main()
{
    coord = position.xy * 0.5 + 0.5;
    vec3 position_for_gl = vec3(position.xy, 1.0);

    // Rotate
    float sin_a = sin(angle);
    float cos_a = cos(angle);
    mat3 rotation = mat3(cos_a, sin_a, 0, -sin_a, cos_a, 0, 0, 0, 1);

    // Apply
    gl_Position = vec4((transform_move_off_center * rotation * position_for_gl).xy, position.zw);
}