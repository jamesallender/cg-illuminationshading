#version 300 es

precision mediump float;

uniform vec3 material_color;

out vec4 FragColor;

void main() {
    FragColor = vec4(material_color, 1.0);
}
