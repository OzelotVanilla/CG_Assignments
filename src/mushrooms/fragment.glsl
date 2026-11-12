#version 300 es
precision mediump float;
// credit: Ozelot
// "Golden Hammer" Mushroom, or whatever you want to call it.
// (Picture: https://esslab.jp/~ess/images/teaching/acg/myxogastria/Trichia-decipiens.png)

out vec4 colour_out ;
// Center of canvas: position is `(0.5, 0.5)`. Upper-Right is `(1.0, 1.0)`.

uniform vec2  u_resolution ;
uniform vec2  u_mouse ;
uniform float u_time ;

const vec4 mushroom_body_colour = vec4(1.0, 0.702, 0.20, 1.0) ;
const vec4 mushroom_foot_colour = vec4(0.294, 0.294, 0.192, 1.0) ;

float sdfCircle(vec2 center_position, float radius, vec2 input_position)
{
    return distance(input_position, center_position) - radius ;
}

float sdfRectangle(vec2 center_position, float width, float height, vec2 input_position)
{
    vec2 input_refer_center_position = input_position - center_position ;
    vec2 quadrant_area = vec2(width, height) * 0.5 ;
    vec2 coord_folded_to_quadrant = abs(input_refer_center_position) - quadrant_area ;

    float distance_if_outside = length(max(coord_folded_to_quadrant, 0.0)) ;
    float distance_inside = min(max(coord_folded_to_quadrant.x, coord_folded_to_quadrant.y), 0.0) ;

    return distance_if_outside + distance_inside ;
}

/**
 * Shape A or B.
 */
float sdfUnion(float sdf_a, float sdf_b)
{
    return min(sdf_a, sdf_b) ;
}

/**
 * Shape A and B.
 */
float sdfIntersect(float sdf_a, float sdf_b)
{
    return max(sdf_a, sdf_b) ;
}

/**
 * Shape Source - Target.
 */
float sdfSubtract(float sdf_source, float sdf_target)
{
    return max(sdf_source, -sdf_target) ;
}

/**
 * Get SDF result of the shape of golden hammer mushroom.
 * @param root_position The vec2 position of the root of the mushroom.
 */
float sdfGoldenHammer(vec2 root_position, vec2 input_position)
{
    vec2 head_root = root_position ;
    head_root.y += 0.106;
    float head = sdfCircle(head_root, 0.05, input_position) ;

    vec2 neck_root = root_position ;
    neck_root.y += 0.056;
    float rect_width = 0.12 ; float rect_height = 0.06 ;
    float rect_of_neck = sdfRectangle(neck_root, rect_width, rect_height, input_position) ;
    float circle_x_offset = rect_width / 2.0 + 0.01 ;
    float circle_size = 0.064 ;
    float left_sub_circle_of_neck = sdfCircle(
        vec2(neck_root.x - circle_x_offset, neck_root.y - rect_height / 2.0),
        circle_size, input_position
    ) ;
    float right_sub_circle_of_neck = sdfCircle(
        vec2(neck_root.x + circle_x_offset, neck_root.y - rect_height / 2.0),
        circle_size, input_position
    ) ;
    float neck = sdfSubtract(sdfSubtract(rect_of_neck, left_sub_circle_of_neck), right_sub_circle_of_neck) ;

    vec2 belly_root = root_position ;
    belly_root.y += 0.01975;
    float belly_width = 0.013 ; float belly_height = 0.01375 ;
    float belly = sdfRectangle(belly_root, belly_width, belly_height, input_position) ;

    vec2 foot_root = root_position ;
    foot_root.y += 0.008;
    float foot = sdfCircle(foot_root, belly_width / 2.0, input_position) ;

    // Union the parts all together.
    float result = sdfUnion(sdfUnion(sdfUnion(head, neck), belly), foot) ;
    return result ;
}

float sdfGoldenHammerScaled(vec2 root_position, float scale, vec2 input_position)
{
    vec2 local_position = (input_position - root_position) / scale;

    return sdfGoldenHammer(vec2(0.0), local_position) * scale;
}

void main()
{
    // Redefining variables.
    vec2  resolution     = u_resolution ;
    vec2  mouse_position = u_mouse / u_resolution.y ; // Normalised to same metric as `position`.
    float time           = u_time ;
    vec2  position = gl_FragCoord.xy / u_resolution.y ;

    // Mushrooms' definition.
    float golden_hammer_1 = sdfGoldenHammerScaled(vec2(0.4, 0.4), 1.2, position) ;
    float golden_hammer_2 = sdfGoldenHammerScaled(vec2(0.6, 0.4), 1.3, position) ;
    float golden_hammer_3 = sdfGoldenHammerScaled(mouse_position, 1.0, position) ;
    float mushrooms = sdfUnion(sdfUnion(golden_hammer_1, golden_hammer_2), golden_hammer_3) ;

    colour_out = mushrooms < 0.0 ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(vec3(0.0), 1.0) ;
}