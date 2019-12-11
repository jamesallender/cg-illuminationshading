#version 300 es

// Do entire lighting equation in here using the passed in normal and position

precision mediump float;

in vec3 frag_pos;
in vec3 frag_normal;

uniform vec3 light_ambient;
uniform vec3 light_position[10];
uniform vec3 light_color[10];
uniform vec3 camera_position;
uniform vec3 material_color;      // Ka and Kd
uniform vec3 material_specular;   // Ks
uniform float material_shininess; // n

out vec4 FragColor;

void main() {

    // our ambient light is the same as it was passed in as
    vec3 ambient = light_ambient;

    vec3 normalTransformed = frag_normal;

    vec3 vertexTransformed = frag_pos;
    vec3 lightDirection = normalize(light_position - vertexTransformed); // l

    // calculate diffuse intensity
    vec3 diffuse = light_color * clamp(dot(normalTransformed, lightDirection),0.0,1.0);

    // this is the manual r alternative
    // vec3 reflectLightDir =  2.0 * dot(normalTransformed, lightDirection) * normalTransformed;
    // vec3 r = normalize(reflectLightDir - lightDirection);

    
    // Calculate reflection vector
    vec3 r = normalize(reflect(-lightDirection, normalTransformed));
    // Calculate view direction
    vec3 viewDirection = normalize(camera_position - vertexTransformed); // v
    // Calculate specular intensity
    vec3 specular = light_color * pow(clamp(dot(r, viewDirection),0.0,1.0), material_shininess);


    FragColor = vec4(clamp(material_color * ambient + material_color * diffuse + material_specular * specular, 0.0, 1.0), 1.0);

}
