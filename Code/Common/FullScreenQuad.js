
'use strict';

function FullScreenQuad( gl, vertexShaderId, fragmentShaderId ) {

    var numComponents = 2;
    
    var attributes = [
        -1,  1,
        -1, -1,
         1,  1,
         1, -1,   
    ];

    // var attributes = [
    //     -1, 1,
    //     -1, -3,
    //      3, 1
    // ];

    var count = attributes.length / numComponents; 

    this.program = initShaders( gl, vertexShaderId, fragmentShaderId );
    gl.useProgram( this.program );
    let attributeLoc = gl.getAttribLocation( this.program, "aPosition" );

    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(attributes), 
        gl.STATIC_DRAW );
    gl.enableVertexAttribArray( attributeLoc );

    // var offset = numComponents * 4 /* sizeof(float) in bytes */;
    // attributeLoc = gl.getAttribLocation( this.program, "vTexCoord" );
    // gl.enableVertexAttribArray( attributeLoc );
    // gl.vertexAttribPointer( attributeLoc, numComponents, 
    //    gl.FLOAT, gl.FALSE, stride, offset );

    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.vertexAttribPointer( attributeLoc, numComponents, 
            gl.FLOAT, gl.FALSE, 0, 0 );

        gl.drawArrays( gl.TRIANGLE_STRIP, 0, count );
    };
};
