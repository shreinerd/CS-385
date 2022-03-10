
"use strict";

var gl;
var disk;
var annulus;

var t = 0;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    annulus = new Disk(4, 0.25);
    annulus.color = vec4(1.0, 0.0, 0.0, 1.0);

    disk = new Disk(36, 0.0);
    disk.color = vec4(0.0, 0.0, 1.0, 1.0);

    requestAnimationFrame(render);
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    let ms = new MatrixStack();

    annulus.PointMode = true;
    ms.translate(-0.5, 0.0, 0.0);
    ms.scale(0.4);
    annulus.MV = ms.current();
    annulus.render();

    ms.loadIdentity();
    ms.translate(0.5, 0.0, 0.0);
    ms.scale(0.4);
    disk.MV = ms.current();
    disk.render();
    
    requestAnimationFrame(render);
}

window.onload = init;