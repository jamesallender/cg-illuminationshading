class GlApp {
    constructor(canvas_id, width, height, scene) {
        this.canvas = document.getElementById(canvas_id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = this.canvas.getContext('webgl2');
        if (!this.gl) {
            alert('Unable to initialize WebGL 2. Your browser may not support it.');
        }

        this.scene = scene;
        // Default set, but changed by drop down in browser
        this.algorithm = 'gouraud';
        // Sets inital shader objects to null
        this.shader = {gouraud_color: null, gouraud_texture: null,
                       phong_color: null,   phong_texture: null};
        this.vertex_position_attrib = 0;
        this.vertex_normal_attrib = 1;
        this.vertex_texcoord_attrib = 2;

        // This matrix will contain the transforms
        this.projection_matrix = glMatrix.mat4.create();
        // This matrix if for the trasformation to move the camera to the originand put the modle in the cononical vew volumne
        this.view_matrix = glMatrix.mat4.create();
        // this is for projecting the model
        this.model_matrix = glMatrix.mat4.create();

        this.vertex_array = {plane: null, cube: null, sphere: null};

        // Dpwnload files
        let gouraud_color_vs = this.GetFile('shaders/gouraud_color.vert');
        let gouraud_color_fs = this.GetFile('shaders/gouraud_color.frag');
        let gouraud_texture_vs = this.GetFile('shaders/gouraud_texture.vert');
        let gouraud_texture_fs = this.GetFile('shaders/gouraud_texture.frag');
        let phong_color_vs = this.GetFile('shaders/phong_color.vert');
        let phong_color_fs = this.GetFile('shaders/phong_color.frag');
        let phong_texture_vs = this.GetFile('shaders/phong_texture.vert');
        let phong_texture_fs = this.GetFile('shaders/phong_texture.frag');
        let emissive_vs = this.GetFile('shaders/emissive.vert');
        let emissive_fs = this.GetFile('shaders/emissive.frag');

        // load files
        Promise.all([gouraud_color_vs, gouraud_color_fs, gouraud_texture_vs, gouraud_texture_fs,
                     phong_color_vs, phong_color_fs, phong_texture_vs, phong_texture_fs,
                     emissive_vs, emissive_fs])
        .then((shaders) => this.LoadShaders(shaders))
        .catch((error) => this.GetFileError(error));
    }

    InitializeGlApp() {
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
        // Enables z buffer
        this.gl.enable(this.gl.DEPTH_TEST);

        // Set models
        this.vertex_array.plane = CreatePlaneVao(this);
        this.vertex_array.cube = CreateCubeVao(this);
        this.vertex_array.sphere = CreateSphereVao(this);

        let fov = 45.0 * (Math.PI / 180.0);
        let aspect = this.canvas.width / this.canvas.height;
        // Create projectipn matrix (the camera paramters like FOV )
        glMatrix.mat4.perspective(this.projection_matrix, fov, aspect, 1.0, 50.0);

        let cam_pos = this.scene.camera.position;
        let cam_target = glMatrix.vec3.create();
        let cam_up = this.scene.camera.up;
        glMatrix.vec3.add(cam_target, cam_pos, this.scene.camera.direction);
        // Set view matrix
        glMatrix.mat4.lookAt(this.view_matrix, cam_pos, cam_target, cam_up);

        this.Render();
    }

    InitializeTexture(image_url) {
        console.log("trying to load: " + image_url);
        // create a texture, and upload a temporary 1px white RGBA array [255,255,255,255]
        let texture = this.gl.createTexture();

        // set up paramaters for texture and make white slide 7 & 12
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        // look at
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

        // make white (maybe black?)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        // load the actual image
        let image = new Image();
        image.crossOrigin = 'anonymous';
        image.addEventListener('load', (event) => {
            this.UpdateTexture(texture, image, image_url);
        }, false);
        image.src = image_url;

        return texture;
    }

    UpdateTexture(texture, image_element, image_url){
        // update the texture from the downloaded texture
        // add image to texture slide 7 & 11
        console.log("Updateing: " + image_url);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image_element);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        console.log("update error: " + this.gl.getError());

        // re render scene with new texture
        this.Render();
    }

    Render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // draw all models --> note you need to properly select shader here
        for (let i = 0; i < this.scene.models.length; i ++) {
            // Set the shader name
            var theShader = this.algorithm + "_" + this.scene.models[i].shader;

            this.gl.useProgram(this.shader[theShader].program);
            console.log(theShader);
            console.log(this.scene.light.ambient);
            console.log(this.shader[theShader].uniform);
            console.log(this.gl.getError());

            // Create model transforms
            glMatrix.mat4.identity(this.model_matrix);
            glMatrix.mat4.translate(this.model_matrix, this.model_matrix, this.scene.models[i].center);
            if (this.scene.models[i].hasOwnProperty("rotate_x")){
                glMatrix.mat4.rotateX(this.model_matrix, this.model_matrix, this.scene.models[i].rotate_x * Math.PI/180);
            }
            if (this.scene.models[i].hasOwnProperty("rotate_y")){
                glMatrix.mat4.rotateY(this.model_matrix, this.model_matrix, this.scene.models[i].rotate_y * Math.PI/180);
            }
            if (this.scene.models[i].hasOwnProperty("rotate_z")){
                glMatrix.mat4.rotateZ(this.model_matrix, this.model_matrix, this.scene.models[i].rotate_z * Math.PI/180);
            }
            glMatrix.mat4.scale(this.model_matrix, this.model_matrix, this.scene.models[i].size);



            if (theShader.includes("texture")) {
                // add uniform for text ure slide 14
                // access texture from the scene.model[i].texture.id
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.scene.models[i].texture.id);
                this.gl.uniform1i(this.shader[theShader].uniform.image, 0);
                this.gl.uniform2fv(this.shader[theShader].uniform.tex_scale, this.scene.models[i].texture.scale);
            }


            // uploading to graphics card
            // upload color, then  matrices for projection, view, and model
            this.gl.uniform3fv(this.shader[theShader].uniform.light_ambient, this.scene.light.ambient);

            this.gl.uniform3fv(this.shader[theShader].uniform.material_col, this.scene.models[i].material.color);
            this.gl.uniform1f(this.shader[theShader].uniform.shininess, this.scene.models[i].material.shininess);
            this.gl.uniform3fv(this.shader[theShader].uniform.material_spec, this.scene.models[i].material.specular);

            //set other things from the shader here

            for(let i = 0; i<this.scene.light.point_lights.length; i++){
                this.gl.uniform3fv(this.shader[theShader].uniform.light_pos[i], this.scene.light.point_lights[i].position);
                this.gl.uniform3fv(this.shader[theShader].uniform.light_col[i], this.scene.light.point_lights[i].color);
            }

            this.gl.uniform3fv(this.shader[theShader].uniform.camera_pos, this.scene.camera.position);
            // adds data to the shaders
            // accessing shaders variable
            this.gl.uniformMatrix4fv(this.shader[theShader].uniform.projection, false, this.projection_matrix);
            this.gl.uniformMatrix4fv(this.shader[theShader].uniform.view, false, this.view_matrix);
            this.gl.uniformMatrix4fv(this.shader[theShader].uniform.model, false, this.model_matrix);

            //Bind vertex array after uploading data apply transform to model and draw
            this.gl.bindVertexArray(this.vertex_array[this.scene.models[i].type]);
            this.gl.drawElements(this.gl.TRIANGLES, this.vertex_array[this.scene.models[i].type].face_index_count, this.gl.UNSIGNED_SHORT, 0);
            this.gl.bindVertexArray(null);
            if (theShader.includes("texture")) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
            }
        }

        // draw all light sources
        for (let i = 0; i < this.scene.light.point_lights.length; i ++) {
            this.gl.useProgram(this.shader['emissive'].program);

            glMatrix.mat4.identity(this.model_matrix);
            glMatrix.mat4.translate(this.model_matrix, this.model_matrix, this.scene.light.point_lights[i].position);
            glMatrix.mat4.scale(this.model_matrix, this.model_matrix, glMatrix.vec3.fromValues(0.1, 0.1, 0.1));


            this.gl.uniform3fv(this.shader['emissive'].uniform.material_col, this.scene.light.point_lights[i].color);

            this.gl.uniformMatrix4fv(this.shader['emissive'].uniform.projection, false, this.projection_matrix);
            this.gl.uniformMatrix4fv(this.shader['emissive'].uniform.view, false, this.view_matrix);
            this.gl.uniformMatrix4fv(this.shader['emissive'].uniform.model, false, this.model_matrix);

            this.gl.bindVertexArray(this.vertex_array['sphere']);
            this.gl.drawElements(this.gl.TRIANGLES, this.vertex_array['sphere'].face_index_count, this.gl.UNSIGNED_SHORT, 0);
            this.gl.bindVertexArray(null);
        }
    }

    UpdateScene(scene) {
        this.scene = scene;

        let cam_pos = this.scene.camera.position;
        let cam_target = glMatrix.vec3.create();
        let cam_up = this.scene.camera.up;
        glMatrix.vec3.add(cam_target, cam_pos, this.scene.camera.direction);
        glMatrix.mat4.lookAt(this.view_matrix, cam_pos, cam_target, cam_up);

        this.Render();
    }

    SetShadingAlgorithm(algorithm) {
        this.algorithm = algorithm;
        this.Render();
    }

    GetFile(url) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    resolve(req.response);
                }
                else if (req.readyState === 4) {
                    reject({url: req.responseURL, status: req.status});
                }
            };
            req.open('GET', url, true);
            req.send();
        });
    }

    GetFileError(error) {
        console.log('Error:', error);
    }

    LoadShaders(shaders) {
        this.LoadColorShader(shaders[0], shaders[1], 'gouraud_color');
        this.LoadTextureShader(shaders[2], shaders[3], 'gouraud_texture');
        this.LoadColorShader(shaders[4], shaders[5], 'phong_color');
        this.LoadTextureShader(shaders[6], shaders[7], 'phong_texture');
        this.LoadEmissiveShader(shaders[8], shaders[9], 'emissive');

        this.InitializeGlApp();
    }

    LoadColorShader(vs_source, fs_source, program_name) {
        let vertex_shader = this.CompileShader(vs_source, this.gl.VERTEX_SHADER);
        let fragment_shader = this.CompileShader(fs_source, this.gl.FRAGMENT_SHADER);

        let program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        this.gl.bindAttribLocation(program, this.vertex_position_attrib, 'vertex_position');
        this.gl.bindAttribLocation(program, this.vertex_normal_attrib, 'vertex_normal');
        this.gl.bindAttribLocation(program, 0, 'FragColor');

        this.LinkShaderProgram(program);

        // Give references to varables on the graphics card so that we can set the value for use in the shaders

        let light_ambient_uniform = this.gl.getUniformLocation(program, 'light_ambient');
        let light_pos_uniform = [];
        let light_col_uniform = [];
		for(let i = 0; i<10; i++){
		    light_pos_uniform.push(this.gl.getUniformLocation(program, 'light_position['+i+']'));
            light_col_uniform.push(this.gl.getUniformLocation(program, 'light_color['+i+']'));
        }
        let camera_pos_uniform = this.gl.getUniformLocation(program, 'camera_position');
        let material_col_uniform = this.gl.getUniformLocation(program, 'material_color');
        let material_spec_uniform = this.gl.getUniformLocation(program, 'material_specular');
        let shininess_uniform = this.gl.getUniformLocation(program, 'material_shininess');
        let projection_uniform = this.gl.getUniformLocation(program, 'projection_matrix');
        let view_uniform = this.gl.getUniformLocation(program, 'view_matrix');
        let model_uniform = this.gl.getUniformLocation(program, 'model_matrix');

        this.shader[program_name] = {
            program: program,
            uniform: {
				light_ambient: light_ambient_uniform,
                light_pos: light_pos_uniform,
                light_col: light_col_uniform,
                camera_pos: camera_pos_uniform,
                material_col: material_col_uniform,
                material_spec: material_spec_uniform,
                shininess: shininess_uniform,
                projection: projection_uniform,
                view: view_uniform,
                model: model_uniform
            }
        };
    }

    LoadTextureShader(vs_source, fs_source, program_name) {
        let vertex_shader = this.CompileShader(vs_source, this.gl.VERTEX_SHADER);
        let fragment_shader = this.CompileShader(fs_source, this.gl.FRAGMENT_SHADER);

        let program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        this.gl.bindAttribLocation(program, this.vertex_position_attrib, 'vertex_position');
        this.gl.bindAttribLocation(program, this.vertex_normal_attrib, 'vertex_normal');
        this.gl.bindAttribLocation(program, this.vertex_texcoord_attrib, 'vertex_texcoord');
        this.gl.bindAttribLocation(program, 0, 'FragColor');

        this.LinkShaderProgram(program);

		let light_ambient_uniform = this.gl.getUniformLocation(program, 'light_ambient');
        let light_pos_uniform = [];
        let light_col_uniform = [];
        for(let i = 0; i<10; i++){
            light_pos_uniform.push(this.gl.getUniformLocation(program, 'light_position['+i+']'));
            light_col_uniform.push(this.gl.getUniformLocation(program, 'light_color['+i+']'));
        }
        let camera_pos_uniform = this.gl.getUniformLocation(program, 'camera_position');
        let material_col_uniform = this.gl.getUniformLocation(program, 'material_color');
        let material_spec_uniform = this.gl.getUniformLocation(program, 'material_specular');
        let tex_scale_uniform = this.gl.getUniformLocation(program, 'texture_scale');
        let image_uniform = this.gl.getUniformLocation(program, 'image');
        let shininess_uniform = this.gl.getUniformLocation(program, 'material_shininess');
        let projection_uniform = this.gl.getUniformLocation(program, 'projection_matrix');
        let view_uniform = this.gl.getUniformLocation(program, 'view_matrix');
        let model_uniform = this.gl.getUniformLocation(program, 'model_matrix');

        this.shader[program_name] = {
            program: program,
            uniform: {
				light_ambient: light_ambient_uniform,
                light_pos: light_pos_uniform,
                light_col: light_col_uniform,
                camera_pos: camera_pos_uniform,
                material_col: material_col_uniform,
                material_spec: material_spec_uniform,
                tex_scale: tex_scale_uniform,
                image: image_uniform,
                shininess: shininess_uniform,
                projection: projection_uniform,
                view: view_uniform,
                model: model_uniform
            }
        };
    }

    LoadEmissiveShader(vs_source, fs_source, program_name) {
        let vertex_shader = this.CompileShader(vs_source, this.gl.VERTEX_SHADER);
        let fragment_shader = this.CompileShader(fs_source, this.gl.FRAGMENT_SHADER);

        let program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        this.gl.bindAttribLocation(program, this.vertex_position_attrib, 'vertex_position');
        this.gl.bindAttribLocation(program, 0, 'FragColor');

        this.LinkShaderProgram(program);

        let material_col_uniform = this.gl.getUniformLocation(program, 'material_color');
        let projection_uniform = this.gl.getUniformLocation(program, 'projection_matrix');
        let view_uniform = this.gl.getUniformLocation(program, 'view_matrix');
        let model_uniform = this.gl.getUniformLocation(program, 'model_matrix');

        this.shader[program_name] = {
            program: program,
            uniform: {
                material_col: material_col_uniform,
                projection: projection_uniform,
                view: view_uniform,
                model: model_uniform
            }
        };
    }

    CompileShader(source, type) {
        // Create a shader object
        let shader = this.gl.createShader(type);

        // Send the source to the shader object
        this.gl.shaderSource(shader, source);

        // Compile the shader program
        this.gl.compileShader(shader);

        // Check to see if it compiled successfully
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shader: ' + this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    CreateShaderProgram(vertex_shader, fragment_shader) {
        let program = this.gl.createProgram();
        this.gl.attachShader(program, vertex_shader);
        this.gl.attachShader(program, fragment_shader);

        return program;
    }

    LinkShaderProgram(program) {
        this.gl.linkProgram(program);

        // Check to see if it linked successfully
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            alert('An error occurred linking the shader program.');
        }
    }
}
