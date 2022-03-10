"use strict";

function Cube(gl) {

    var program = initShaders(gl, "Cube-vertex-shader", "Cube-fragment-shader");

    var positions = [
        // --> Insert your vertex positions here
        [ 0, 0, 0 ],
        [ 1, 0, 0 ],
        [ 1, 1, 0 ],
        [ 0, 1, 0 ],
        [ 0, 0, 1 ],
        [ 1, 0, 1 ],
        [ 1, 1, 1 ],
        [ 0, 1, 1 ]
    ];
    
    var indices = [
        // --> Insert you index values here
        0, 1, 2,
        0, 2, 3,
        1, 5, 6,
        1, 6, 2,
        5, 7, 4,
        5, 7, 6,
        4, 0, 3,
        4, 3, 7,
        4, 1, 0,
        4, 5, 1,
        3, 2, 6,
        3, 6, 7,
    ];

    var faces = Array(36).fill(0).map((_, i) => Math.floor(i / 6));
    
    var vertices = [];
    for (var i = 0; i < indices.length; ++i)
        vertices.push(positions[indices[i]]);
    vertices = vertices.flat();
    
    var edges = [ 
        0, 1,
        1, 2,
        2, 3,
        3, 0,
        4, 5,
        5, 6,
        6, 7,
        7, 4,
        1, 5,
        2, 6,
        0, 4,
        3, 7,
    ];

    positions.numComponents = 3;
    faces.numComponents = 1;

    positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );

    faces.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, faces.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(faces), gl.STATIC_DRAW);

    indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

    edges.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, edges.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(edges), gl.STATIC_DRAW);

    positions.aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.enableVertexAttribArray( positions.aPosition );

    faces.aFace = gl.getAttribLocation( program, "aFace" );
    gl.enableVertexAttribArray( faces.aFace );
    // gl.vertexAttribDivisor( faces.aFace, 1 );

    var P = gl.getUniformLocation(program, "P");
    this.P = mat4();

    var MV = gl.getUniformLocation(program, "MV");
    this.MV = mat4();

    console.log(faces)

    this.render = function () {
        gl.useProgram( program );

        gl.uniformMatrix4fv(MV, false, flatten(this.MV));
        gl.uniformMatrix4fv(P, false, flatten(this.P));

        gl.bindBuffer( gl.ARRAY_BUFFER, positions.buffer );
        gl.vertexAttribPointer( positions.aPosition, positions.numComponents,
            gl.FLOAT, false, 0, 0 );
 
        gl.bindBuffer( gl.ARRAY_BUFFER, faces.buffer );
        gl.vertexAttribPointer( faces.aFace, faces.numComponents, 
            gl.FLOAT, false, 0, 0 );

        gl.drawArrays( gl.TRIANGLES, 0, indices.length);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indices.buffer );
        // gl.drawElements( gl.POINTS, indices.length, gl.UNSIGNED_SHORT, 0 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, edges.buffer );
        // gl.drawElements( gl.LINES, edges.length, gl.UNSIGNED_SHORT, 0 );
    }
};
