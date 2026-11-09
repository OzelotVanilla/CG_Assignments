#version 300 es
precision mediump float ;

in      float coord_camera_depth ;
flat in int   id_of_object_fragment ;
out     vec4  colour_out ;

const vec4 floor_colour = vec4(0.639, 0.639, 0.635, 1.0) ;
const vec4 ramiel_colour_near = vec4(0.0, 0.482, 0.733, 1.0) ;
const vec4 ramiel_colour_far = vec4(0.098, 0.267, 0.557, 1.0) ;
const vec4 white_colour = vec4(1.0) ;

const float ramiel_near = 3.5 ;
const float ramiel_far  = 5.0 ;

void main()
{
    float ramiel_colour_factor = clamp(
        (ramiel_far - coord_camera_depth) / (ramiel_far - ramiel_near),
        0.0, 1.0
    ) ;
    vec4 ramiel_colour = mix(ramiel_colour_far, ramiel_colour_near, ramiel_colour_factor) ;

    if(id_of_object_fragment == 0) // ObjectDrawnID.floor
    {
        colour_out = floor_colour ;
    }
    else if(id_of_object_fragment == 10) // ObjectDrawnID.ramiel_upper
    {
        colour_out = ramiel_colour ;
    }
    else if(id_of_object_fragment == 11) // ObjectDrawnID.ramiel_lower
    {
        colour_out = ramiel_colour ;
    }
    else if(id_of_object_fragment == 12) // ObjectDrawnID.ramiel_laser
    {
        colour_out = vec4(0.0, 0.0, 0.0, 1.0) ;
    }
}