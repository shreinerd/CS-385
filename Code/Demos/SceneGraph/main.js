
var scene = undefined;

window.onload = function () {
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl2");

    scene = new SceneGraph();

    scene.addChild()

    render();    
};

function render() {

    requestAnimationFrame(render);
}