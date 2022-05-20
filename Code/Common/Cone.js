
function Cone( gl, numSides, vertexShaderId, fragmentShaderId ) {

    "use strict";

    const DefaultNumSides = 8;

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cone-vertex-shader";
    var fragShdr = fragmentShaderId || "Cone-fragment-shader";

    var program = initShaders(gl, vertShdr, fragShdr);

    var n = numSides || DefaultNumSides; // Number of sides 

    var theta = 0.0;
    var dTheta = 2.0 * Math.PI / n;
    
    // Initialize temporary arrays for the Cone's indices and vertex positions
    //
    var positions = [ 0.0, 0.0, 0.0 ];
    var indices = [ 0 ];
    
    for ( var i = 0; i < n; ++i ) {
        theta = i * dTheta;
        positions.push( Math.cos(theta), Math.sin(theta), 0.0 );

        indices.push(n - i);
    }

    positions.push( 0.0, 0.0, 1.0 );

    positions.numComponents = 3;
    
    // Close the triangle fan by repeating the first (non-center) point.
    //
    indices.push(n);

    // Now build up the list for the cone.  First, add the apex vertex onto the index list
    //
    indices.push(n + 1);

    // Next, we need to append the rest of the vertices for the perimeter of the disk.
    // However, the cone's perimeter vertices need to be reversed since it's effectively a
    // reflection of the bottom disk.
    //
    indices = indices.concat( indices.slice(1,n+2).reverse() );

    positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

    indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.enableVertexAttribArray( aPosition );

    var P = gl.getUniformLocation( program, "P" );
    if ( P ) { this.P = mat4(); }

    var MV = gl.getUniformLocation( program, "MV" );
    if ( MV ) { this.MV = mat4(); }

    var color = gl.getUniformLocation( program, "color" );
    if ( color ) { this.color = vec4(1.0); }

    this.render = function () {
        gl.useProgram( program );

        gl.bindBuffer( gl.ARRAY_BUFFER, positions.buffer );
        gl.vertexAttribPointer( aPosition, positions.numComponents,
            gl.FLOAT, gl.FALSE, 0, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indices.buffer );

        if ( P ) { gl.uniformMatrix4fv( P, false, flatten(this.P) ); }
        if ( MV ) { gl.uniformMatrix4fv( MV, false, flatten(this.MV) ); }
        if ( color ) { gl.uniform4fv( color, flatten(this.color) ); }

        var count = indices.length / 2;
        var offset = 0;
        var topology = this.PointMode ? gl.POINTS : gl.TRIANGLE_FAN;
        // Draw the cone's base
        //
        
        // Draw the cone's top
        //
        offset = count * 2 /* sizeof(UNSIGNED_SHORT) */;
        gl.drawElements( topology, count, gl.UNSIGNED_SHORT, offset );
    }
};
