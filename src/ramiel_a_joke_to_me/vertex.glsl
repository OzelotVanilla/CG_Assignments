#version 300 es
in       vec4  position ; // vertex position, will be fill `1.0` to position to enable vec4 calc.
out      float coord_camera_depth ;
flat out int   id_of_object_fragment ;

uniform float time ;
uniform float rock_ramiel_started_time ;
uniform int   id_of_object_vertex ;
uniform int   is_rocking_ramiel ;

/** Position of camera. */
const vec3 camera_position = vec3(0.0, 0.8, 5.0) ;
/** What camera should see. */
const vec3 camera_target   = vec3(0.0, 0.0, 0.0) ;
/** FOV of camera. Unit is angle. */
const float fov_angle = 60.0 ;

/** Helpful for calc camera right since it is perp to world up and camera forward. */
const vec3 world_up = vec3(0.0, 1.0, 0.0) ;

const float screen_aspect = 16.0 / 9.0 ;
const float near_plane = 0.1 ;
const float far_plane = 100.0 ;

/** How long it takes Ramiel to finish one cycle of rotating. */
const float n_sec_for_a_cycle = 4.0 ;

const float pi = 3.14159265359 ;


/**
 * Make a camera that observe Ramiel rotating.
 * Need to make matrix `model`, `view`, `projection`.
 */
void main()
{
    // // Model matrix.
    // Rotation.
    float progress_of_rotation = mod(time, n_sec_for_a_cycle) / n_sec_for_a_cycle ;
    float theta_of_rotation    = progress_of_rotation * 2.0 * pi ;
    mat4 rotation_matrix = mat4(
        cos(theta_of_rotation),    0, -sin(theta_of_rotation),    0,
                             0,    1,                       0,    0,
        sin(theta_of_rotation),    0,  cos(theta_of_rotation),    0,
                             0,    0,                       0,    1
    ) ;
    // Remember ground (ID less than 10) not rotate.
    mat4 model_matrix = id_of_object_vertex < 10 ? mat4(1.0) : rotation_matrix;

    // // View matrix.
    vec3 camera_forward = normalize(camera_target - camera_position) ;
    vec3 camera_right   = normalize(cross(camera_forward, world_up)) ;
    vec3 camera_up      = normalize(cross(camera_right, camera_forward)) ;

    float dotpos_forward =  dot(camera_position, camera_forward) ;
    float dotpos_right   = -dot(camera_position, camera_right) ;
    float dotpos_up      = -dot(camera_position, camera_up) ;

    mat4 view_matrix = mat4(
        camera_right.x,  camera_up.x,  -camera_forward.x,  0.0,
        camera_right.y,  camera_up.y,  -camera_forward.y,  0.0,
        camera_right.z,  camera_up.z,  -camera_forward.z,  0.0,
          dotpos_right,    dotpos_up,     dotpos_forward,  1.0
    ) ;

    // // Projection matrix.
    // Make a standard perspective project matrix with simplified version matrix.
    float fov_rad = radians(fov_angle) ;
    float focal_length_scale = 1.0 / tan(fov_rad / 2.0) ;
    float horizontal_projection_scale = focal_length_scale / screen_aspect ;
    float depth_scale = -(far_plane + near_plane) / (far_plane - near_plane) ;
    float depth_offset = -(2.0 * far_plane * near_plane) / (far_plane - near_plane) ;
    mat4 projection_matrix = mat4(
        horizontal_projection_scale,                0.0,             0.0,     0.0,
                                0.0, focal_length_scale,             0.0,     0.0,
                                0.0,                0.0,     depth_scale,    -1.0,
                                0.0,                0.0,    depth_offset,     0.0
    ) ;

    // // Calc final gl clip space position.
    vec4 view_position = view_matrix * model_matrix * position ;
    gl_Position = projection_matrix * view_position ;

    // // Pass param to fragment shader.
    coord_camera_depth = -view_position.z ;
    id_of_object_fragment = id_of_object_vertex ;
}