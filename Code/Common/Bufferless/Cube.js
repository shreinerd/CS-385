
function Cube( vertexShader, fragmentShader ) {
    "use strict";

    let = program( gl,
        vertexShader || "Cube-vertex-shader",
        fragmentShader || "Cube-fragment-shader" );    

    this.render = function () {
        gl.useProgram( program );

        gl.drawArraysInstanced( gl.TRIANGLE_STRIP, 0, 4, 6 );
    }
};