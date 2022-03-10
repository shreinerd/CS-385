
"use strict";

var gl;
var sun;
var earth;
var moon;

var t = 0;
var near = 10;
var far = 100;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    sun = new Sphere(20, 10);
    earth = new Sphere(20, 10);
    moon = new Sphere(10, 5);

    var P = perspective(75.0, 1.0, near, far);

    sun.radius = 10;
    sun.color = vec4(1.0, 1.0, 0.0, 1.0);
    sun.P = P;

    earth.radius = 1;
    earth.color = vec4(0.0, 0.0, 1.0, 1.0);
    earth.distance = 40;
    earth.P = P;

    moon.radius = 0.1;
    moon.color = vec4(0.2, 0.2, 0.2, 1.0);
    moon.distance = 3;
    moon.P = P;
    
    // Add your sphere creation and configuration code here

    requestAnimationFrame(render);
}

function render() {

    t += 1.0;
    // Update your motion variables here

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
    // Add your rendering sequence here
    
    var V = translate(0.0, 0.0, -0.5 * (near + far));

    sun.PointMode = true;
    var ms = new MatrixStack();
    ms.load(V);
    ms.push();
    ms.scale(sun.radius);
    sun.MV = ms.current();
    sun.render();
    ms.pop();

    ms.push();
    ms.rotate(t, [0, 1, 0]);
    ms.translate(earth.distance, 0.0, 0.0);
    ms.rotate(t % 24, [0, 1, 0]);
    ms.push();
    ms.scale(earth.radius);
    earth.MV = ms.current();
    earth.render();
    ms.pop();
    ms.translate(moon.distance, 0.0, 0.0);
    ms.scale(moon.radius);
    moon.MV = ms.current();
    moon.render();
    ms.pop();
    ms.pop();

    requestAnimationFrame(render);
}

window.onload = init;