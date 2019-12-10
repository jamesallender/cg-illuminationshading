#version 300 es

// Just calculate the verex normal and position to be interpolated for use in the frag shader to calculate light with
// same as a color shader, the only thing that is different is the material color is the texel color * the material color

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;
in vec2 vertex_texcoord;

uniform vec2 texture_scale;
uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 frag_pos;
out vec3 frag_normal;
out vec2 frag_texcoord;

void main() {
    // calculate our matrix to transform, our normal vector
    mat3 normalModelMatrix = inverse(transpose(mat3(model_matrix)));
    // transform normal to world position and normalize
    frag_normal = normalize(normalModelMatrix * vertex_normal);

    // transform vertex to world position
    frag_pos = vec3(model_matrix * vec4(vertex_position, 1.0));

    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);

    frag_texcoord = vertex_texcoord * texture_scale;
}
