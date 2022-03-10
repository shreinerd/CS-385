
function Cube( vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    let vertShdr = vertexShaderId || "Cube-vertex-shader";
    let fragShdr = fragmentShaderId || "Cube-fragment-shader";

    let program = initShaders(gl, vertShdr, fragShdr);

    // Query shader program variable information
    aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.enableVertexAttribArray( aPosition );

    P = gl.getUniformLocation( program, "P" );
    MV = gl.getUniformLocation( program, "MV" );

    // Define properties for setting shader variables
    if ( P )  { this.P = undefined; }
    if ( MV ) { this.MV = undefined; }

    aPosition.data = new Float32Array([
        -0.5, -0.5,  0.5,  // Vertex 0
         0.5, -0.5,  0.5,  // Vertex 1
         0.5,  0.5,  0.5,  // Vertex 2
        -0.5,  0.5,  0.5,  // Vertex 3
        -0.5, -0.5, -0.5,  // Vertex 4
         0.5, -0.5, -0.5,  // Vertex 5
         0.5,  0.5, -0.5,  // Vertex 6
        -0.5,  0.5, -0.5,  // Vertex 7
    ]);
    
    let indices.data = new Uint16Array([
        0, 2, 1,
        0, 3, 2,
        1, 2, 6,
        1, 6, 5,
        0, 4, 3,
        4, 7, 3,
        5, 7, 4,
        5, 6, 7,
        3, 6, 2,
        3, 7, 6,
        4, 1, 5,
        4, 0, 1  
    ]);
        
    aPosition.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, aPosition.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, aPosition.data, gl.STATIC_DRAW );

    indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices.data, gl.STATIC_DRAW );

    this.render = function () {
        gl.useProgram( program );

        gl.bindBuffer( gl.ARRAY_BUFFER, aPosition.buffer );
        gl.vertexAttribPointer( aPosition, aPosition.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indices.buffer );

        if ( P )  { gl.uniformMatrix4fv( P, false, flatten(this.P) ); }
        if ( MV ) { gl.uniformMatrix4fv( MV, false, flatten(this.MV) ); }

        // Draw the cube's base
        gl.drawElements( gl.TRIANGLES, indices.count, gl.UNSIGNED_SHORT, 0 );
    }
};