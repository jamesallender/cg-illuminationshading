#version 300 es

precision mediump float;

in vec3 ambient;
in vec3 diffuse;
in vec3 specular;

uniform vec3 material_color;    // Ka and Kd
uniform vec3 material_specular; // Ks

out vec4 FragColor;

void main() {
    // calculate fragment color with color values clamped
    FragColor = vec4(clamp(material_color * ambient + material_color * diffuse + material_specular * specular, 0.0, 1.0), 1.0);
}
