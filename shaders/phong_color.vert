#version 300 es

// Just calculate the vertex normal and position to be interpolated for use in the frag shader to calculate light with

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

// position of the vertex in world coordinates
out vec3 frag_pos;
// normal of the vertex in world coordinates
// will be interpolated when going to frag shader for all pixel fragments in triangle
out vec3 frag_normal;

void main() {
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);
}
