
var gl = null;
var texture = null;
var fbo = null;
var texLoc = null;

function init() {
  var canvas = document.getElementById( "webgl-canvas" );
  gl = canvas.getContext("webgl2");

  if ( !gl ) {
    alert("Unable to setup WebGL");
    return;
  }

  var w = canvas.width;
  var h = canvas.height;

  texture = gl.createTexture();
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

  fbo = gl.createFramebuffer();
  gl.bindFramebuffer( gl.FRAMEBUFFER, fbo );
  gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0 );

  quad1 = new FullScreenQuad( gl, "Quad-vs", "Quad1-fs" );
  quad2 = new FullScreenQuad( gl, "Quad-vs", "Quad2-fs" );
  var texLod = gl.getUniformLocation( quad2.program, "texture" );
  gl.useProgram( quad2.program );
  gl.uniform1i( texLod, 0 );

  render();
}

function render() {
  gl.bindFramebuffer( gl.FRAMEBUFFER, fbo );
  quad1.render();

  gl.bindFramebuffer( gl.FRAMEBUFFER, null );
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, texture );

  quad2.render();
}

window.onload = init;
