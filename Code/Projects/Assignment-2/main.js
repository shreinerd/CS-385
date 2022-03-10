
var gl = null;
var cone = null;

function init() {
    var canvas = document.getElementById("webgl-canvas");
    
    gl = canvas.getContext("webgl2");
    
    if (!gl) {
        console.log("WebGL2 isn't available");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    cone = new Cone(gl, 46);

    render();
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    cone.render();
}

window.onload = init;