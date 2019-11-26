#version 300 es

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;

uniform vec3 light_ambient;
uniform vec3 light_position;
uniform vec3 light_color;
uniform vec3 camera_position;
uniform float material_shininess; // n
uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 ambient;
out vec3 diffuse;
out vec3 specular;

void main() {
    ambient = light_ambient;
    mat3 normalModelMatrix = inverse(transpose(mat3(model_matrix)));
    vec3 normalTransformed = normalize(normalModelMatrix * vertex_normal); // n
    vec3 vertexTransformed = vec3(model_matrix * vec4(vertex_position, 1.0));
    vec3 lightDirection = normalize(light_position - vertexTransformed); // l

    diffuse = light_color * clamp(dot(normalTransformed, lightDirection),0.0,1.0);

    vec3 reflectLightDir =  vec3(2) * dot(normalTransformed, lightDirection) * normalTransformed;
    vec3 r = clamp(reflectLightDir, 0.0, 1.0) - lightDirection; //? where to clamp

    vec3 viewDirection = normalize(camera_position - vertexTransformed); // v
    specular = light_color * pow(dot(reflectLightDir, viewDirection), material_shininess);



    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);
}
