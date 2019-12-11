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

    vec3 specular = vec3(0.0, 0.0, 0.0);
    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    for (int i = 0; i < 10; i++){
        vec3 normalTransformed = frag_normal;

        vec3 vertexTransformed = frag_pos;
        vec3 lightDirection = normalize(light_position[i] - vertexTransformed); // l

        // calculate diffuse intensity
        diffuse += light_color[i] * clamp(dot(normalTransformed, lightDirection),0.0,1.0);

        // this is the manual r alternative
        // vec3 reflectLightDir =  2.0 * dot(normalTransformed, lightDirection) * normalTransformed;
        // vec3 r = normalize(reflectLightDir - lightDirection);


        // Calculate reflection vector
        vec3 r = normalize(reflect(-lightDirection, normalTransformed));
        // Calculate view direction
        vec3 viewDirection = normalize(camera_position - vertexTransformed); // v
        // Calculate specular intensity
        specular += light_color[i] * pow(clamp(dot(r, viewDirection),0.0,1.0), material_shininess);
    }
    specular = clamp(specular, 0.0, 1.0);
    diffuse = clamp(diffuse, 0.0, 1.0);


    FragColor = vec4(clamp(material_color * ambient + material_color * diffuse + material_specular * specular, 0.0, 1.0), 1.0);

}
