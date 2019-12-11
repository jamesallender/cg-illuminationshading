#version 300 es

// same as a color shader, the only thing that is different is the material color is the texel color * the material color

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;
in vec2 vertex_texcoord;

uniform vec3 light_ambient;
uniform vec3 light_position[10];
uniform vec3 light_color[10];
uniform vec3 camera_position;
uniform float material_shininess;
uniform vec2 texture_scale;
uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 ambient;
out vec3 diffuse;
out vec3 specular;
out vec2 frag_texcoord;

void main() {

    // not sure this line is right
    frag_texcoord = vertex_texcoord * texture_scale;

    // our ambient light is the same as it was passed in as
    ambient = light_ambient;

    // calculate our matrix to transform, our normal vector
    mat3 normalModelMatrix = inverse(transpose(mat3(model_matrix)));
    // transform normal to world position and normalize
    vec3 normalTransformed = normalize(normalModelMatrix * vertex_normal); // n

    // transform vertex to world position
    vec3 vertexTransformed = vec3(model_matrix * vec4(vertex_position, 1.0));
    // calculate light direction vector

    vec3 lightDirection = normalize(light_position - vertexTransformed); // l

    // calculate diffuse intensity
    diffuse = light_color * clamp(dot(normalTransformed, lightDirection),0.0,1.0);

    // this is the manual r alternative
    // vec3 reflectLightDir =  2.0 * dot(normalTransformed, lightDirection) * normalTransformed;
    // vec3 r = normalize(reflectLightDir - lightDirection);
    // Calculate reflection vector
    vec3 r = reflect(-lightDirection, normalTransformed);
    // Calculate view direction
    vec3 viewDirection = normalize(camera_position - vertexTransformed); // v
    // Calculate specular intensity
    specular = light_color * pow(clamp(dot(r, viewDirection),0.0,1.0), material_shininess);

    // calculate projected xy coordinate for vertex in window
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);
}
