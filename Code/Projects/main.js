
function init() {
    canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl2");

    gl.clearColor(.0, .15, .23, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function render() {

}

window.onload = init;