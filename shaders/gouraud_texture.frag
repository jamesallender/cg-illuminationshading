#version 300 es

// same as a color shader, the only thing that is different is the material color is the texel color * the material color

precision mediump float;

in vec3 ambient;
in vec3 diffuse;
in vec3 specular;
in vec2 frag_texcoord;

uniform vec3 material_color;    // Ka and Kd
uniform vec3 material_specular; // Ks
uniform sampler2D image;        // use in conjunction with Ka and Kd

out vec4 FragColor;

void main() {
    vec3 texel_color = vec3(texture(image, frag_texcoord));
    // calculate fragment color with color values clamped
    // color for pixel is the color of the texel * the color of the material
    FragColor = vec4(clamp((material_color * texel_color) * ambient + (material_color * texel_color) * diffuse + (material_color * texel_color) * specular, 0.0, 1.0), 1.0);
}
