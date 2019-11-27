#version 300 es

precision highp float;

// These are the vertex particular values that are changing between vertices
in vec3 vertex_position;
in vec3 vertex_normal;

// these are the model specific values that do not change
uniform vec3 light_ambient;
uniform vec3 light_position;
uniform vec3 light_color;
uniform vec3 camera_position;
uniform float material_shininess; // n
uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

// these are out per vertex outputs where we are calculating the intensity of the ambient, defuse, and specular light
// and then we will multiply these intensities by the model color in the fragment shader
out vec3 ambient;
out vec3 diffuse;
out vec3 specular;

void main() {

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
