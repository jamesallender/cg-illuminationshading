function CreatePlaneVao(glapp) {
    let vertex_array = glapp.gl.createVertexArray();
    glapp.gl.bindVertexArray(vertex_array);

    // Vertices
    let vertex_position_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_position_buffer);
    let vertices = [
        -0.5, 0.0,  0.5,
         0.5, 0.0,  0.5,
         0.5, 0.0, -0.5,
        -0.5, 0.0, -0.5
    ];
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(vertices), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_position_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_position_attrib, 3, glapp.gl.FLOAT, false, 0, 0);

    // Normals
    let vertex_normal_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_normal_buffer);
    let normals = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ];
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(normals), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_normal_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_normal_attrib, 3, glapp.gl.FLOAT, false, 0, 0);

    // Texture coordinates
    let vertex_texcoord_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_texcoord_buffer);
    let texcoords = [
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0
    ];
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(texcoords), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_texcoord_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_texcoord_attrib, 2, glapp.gl.FLOAT, false, 0, 0);

    // Faces of the triangles
    let vertex_index_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
    let indices = [
         0,  1,  2,      0,  2,  3,
    ];
    glapp.gl.bufferData(glapp.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glapp.gl.STATIC_DRAW);

    glapp.gl.bindVertexArray(null);

    vertex_array.face_index_count = indices.length;

    return vertex_array;
}

function CreateCubeVao(glapp) {
    let vertex_array = glapp.gl.createVertexArray();
    glapp.gl.bindVertexArray(vertex_array);

    // Vertices
    let vertex_position_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_position_buffer);
    let vertices = [
        // Front face
        -0.5, -0.5,  0.5,
         0.5, -0.5,  0.5,
         0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,

        // Back face
         0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5,  0.5, -0.5,
         0.5,  0.5, -0.5,

        // Top face
        -0.5,  0.5,  0.5,
         0.5,  0.5,  0.5,
         0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,

        // Bottom face
         0.5, -0.5,  0.5,
        -0.5, -0.5,  0.5,
        -0.5, -0.5, -0.5,
         0.5, -0.5, -0.5,

        // Right face
         0.5, -0.5,  0.5,
         0.5, -0.5, -0.5,
         0.5,  0.5, -0.5,
         0.5,  0.5,  0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5
    ];
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(vertices), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_position_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_position_attrib, 3, glapp.gl.FLOAT, false, 0, 0);

    // Normals
    let vertex_normal_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_normal_buffer);
    let normals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(normals), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_normal_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_normal_attrib, 3, glapp.gl.FLOAT, false, 0, 0);

    // Texture coordinates
    let vertex_texcoord_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_texcoord_buffer);
    let texcoords = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,

        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0
    ];
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(texcoords), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_texcoord_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_texcoord_attrib, 2, glapp.gl.FLOAT, false, 0, 0);

    // Faces of the triangles
    let vertex_index_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
    let indices = [
         0,  1,  2,      0,  2,  3,   // Front
         4,  5,  6,      4,  6,  7,   // Back
         8,  9, 10,      8, 10, 11,   // Top
        12, 13, 14,     12, 14, 15,   // Bottom
        16, 17, 18,     16, 18, 19,   // Right
        20, 21, 22,     20, 22, 23    // Left
    ];
    glapp.gl.bufferData(glapp.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glapp.gl.STATIC_DRAW);

    glapp.gl.bindVertexArray(null);

    vertex_array.face_index_count = indices.length;

    return vertex_array;
}

function CreateSphereVao(glapp) {
    let vertex_array = glapp.gl.createVertexArray();
    glapp.gl.bindVertexArray(vertex_array);

    let slices = 36;
    let stacks = 18;

    let phi = 0;
    let delta_phi = 2 * Math.PI / slices;
    let theta = Math.PI / 2;
    let delta_theta = -Math.PI / stacks;

    let vertices = [];
    let normals = [];
    let texcoords = [];
    for (let i = 0; i <= slices; i++) {
        let cos_phi = Math.cos(phi);
        let sin_phi = Math.sin(phi);
        theta = Math.PI / 2;
        for (let j = 0; j <= stacks; j++) {
            let cos_theta = Math.cos(theta);
            let sin_theta = Math.sin(theta);
            let x = cos_theta * cos_phi;
            let y = sin_theta;
            let z = cos_theta * -sin_phi;
            vertices.push(x/2, y/2, z/2);
            normals.push(x, y, z);
            texcoords.push(i / slices, 1.0 - j / stacks);

            theta += delta_theta;
        }
        phi += delta_phi;
    }

    let indices = [];
    for (let i = 0; i < slices; i++) {
        let k1 = i * (stacks + 1);
        let k2 = (i + 1) * (stacks + 1);
        for (let j = 0; j < stacks; j++) {
            indices.push(k1, k1 + 1, k2);
            indices.push(k1 + 1, k2 + 1, k2);
            k1++;
            k2++;
        }
    }

    // Vertices
    let vertex_position_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_position_buffer);
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(vertices), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_position_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_position_attrib, 3, glapp.gl.FLOAT, false, 0, 0);

    // Normals
    let vertex_normal_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_normal_buffer);
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(normals), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_normal_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_normal_attrib, 3, glapp.gl.FLOAT, false, 0, 0);

    // Texture coordinates
    let vertex_texcoord_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ARRAY_BUFFER, vertex_texcoord_buffer);
    glapp.gl.bufferData(glapp.gl.ARRAY_BUFFER, new Float32Array(texcoords), glapp.gl.STATIC_DRAW);
    glapp.gl.enableVertexAttribArray(glapp.vertex_texcoord_attrib);
    glapp.gl.vertexAttribPointer(glapp.vertex_texcoord_attrib, 2, glapp.gl.FLOAT, false, 0, 0);

    // Faces of the triangles
    let vertex_index_buffer = glapp.gl.createBuffer();
    glapp.gl.bindBuffer(glapp.gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
    glapp.gl.bufferData(glapp.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glapp.gl.STATIC_DRAW);

    glapp.gl.bindVertexArray(null);

    vertex_array.face_index_count = indices.length;

    return vertex_array;
}