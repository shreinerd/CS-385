
'use strict';

function DrawArray( gl, primType, numComponents, positions, vertexShader, fragmentShader ) {

    this.program = initShaders(gl, vertexShader, fragmentShader);
    gl.useProgram( this.program );
    var attributeLoc = gl.getAttribLocation( this.program, "aPosition" );
    
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), 
        gl.STATIC_DRAW );
    gl.enableVertexAttribArray( attributeLoc );

    gl.uniformMatrix4fv( gl.getUniformLocation( this.program, "P" ),
        false, flatten(mat4()) );
    gl.uniformMatrix4fv( gl.getUniformLocation( this.program, "MV" ),
        false, flatten(mat4()) );
    gl.uniform4fv( gl.getUniformLocation( this.program, "color"),
        [ 1.0, 1.0, 1.0, 1.0 ]);

    this.render = function () {
        gl.useProgram( this.program );

        var count = positions.length / numComponents;

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.vertexAttribPointer( attributeLoc, numComponents, 
            gl.FLOAT, gl.FALSE, 0, 0 );

        gl.drawArrays( primType, 0, count );
    };
};
