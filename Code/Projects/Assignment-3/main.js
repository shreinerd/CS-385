
"use strict";

var gl;
var cube;
var angle = 0;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    cube = new Cube(gl);
    cube.P = perspective(90.0, 1.0, 1.0, 4.0);

    requestAnimationFrame(render);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    angle += 1.0;

    var T = translate(0, 0, -2);
    var R = rotate(angle, [1, 1, 1 ]);
    cube.MV = R; // mult(T, R);

    cube.render();

    requestAnimationFrame(render);
}

window.onload = init;