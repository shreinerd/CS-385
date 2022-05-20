
'use strict';

var gl = null;
var textures = [];
var fbo = null;

var step = null;
var display = null;

// Specify the "texture cursors", which control the role of each texture in
// a frame (i.e., one that's being rendered into, and one that's being read
// from).  Each frame we'll update these values to do the buffer ping-pong
// operation.
var src = 0;
var dst = 1;
var NumTextures = 2;

var w;
var h;
var texWidth;
var texHeight;

function init() {
  var canvas = document.getElementById( "webgl-canvas" );
  gl = canvas.getContext("webgl2");

  // Record the size of the viewport.  We'll need this to convert from
  // viewport fragment coordinates to texture coordinates
  w = canvas.width;
  h = canvas.height;

  texWidth = w;
  texHeight = h;

  // Create two textures that we'll use to ping-pong between for each 
  // frame of the application
  for ( var i = 0; i < NumTextures; ++i ) {
    textures[i] = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, textures[i] );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, texWidth, texHeight, 0, gl.RGB,
       gl.UNSIGNED_BYTE, null );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
  }

  step = new FullScreenQuad( gl, "Quad-vs", "Generator-fs" );
  step.texLoc = gl.getUniformLocation( step.program, "texture" );
  step.viewportLoc = gl.getUniformLocation( step.program, "viewportSize" );
  gl.useProgram( step.program );
  gl.uniform1i( step.texLoc, 0 );
  gl.uniform2fv( step.viewportLoc, [ w, h ] );

  display = new FullScreenQuad( gl, "Quad-vs", "Display-fs" ); 
  display.texLoc = gl.getUniformLocation( display.program, "texture" );
  display.viewportSize = gl.getUniformLocation( display.program, 
    "viewportSize" );
  gl.useProgram( display.program );
  gl.uniform1i( display.texLoc, 0 );
  gl.uniform2fv( display.viewportSize, [ w, h ]);

  // Create an FBO to receive the output of rendering.
  fbo = gl.createFramebuffer();

  // Attach the source texture to the FBO so that we can initialize the
  // game of life cells
  gl.bindFramebuffer( gl.FRAMEBUFFER, fbo );
  gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D, textures[dst], 0 );
  gl.viewport( 0, 0, texWidth, texHeight);

  // Initialize the Game of Life population by rendering a bunch of
  // points into our source texture
  var NumPoints = 200000;
  var positions = [];
  for ( var i = 0; i < NumPoints; ++i ) {
    // generate two components per vertex
    positions.push( 2.0 * Math.random() - 1.0 );
    positions.push( 2.0 * Math.random() - 1.0 );
  }

  var initialState = new DrawArray( gl, gl.POINTS, 2, positions, "DrawArrays-vs", "DrawArrays-fs;" );
  initialState.render();

  gl.bindFramebuffer( gl.FRAMEBUFFER, null );

  render();
}

function render() {
  src = (src + 1) % NumTextures;
  dst = (src + 1) % NumTextures;

  gl.bindFramebuffer( gl.FRAMEBUFFER, fbo );
  gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, 
    gl.TEXTURE_2D, textures[dst], 0 );
  gl.viewport( 0, 0, texWidth, texHeight );

  gl.bindTexture( gl.TEXTURE_2D, textures[src] );
  
  gl.useProgram( step.program );
  gl.uniform1i( step.texLoc, 0 );
  gl.uniform2fv( step.viewportLoc, [ w, h ] );

  step.render();
 
  gl.bindFramebuffer( gl.FRAMEBUFFER, null );
  gl.viewport( 0, 0, w, h );
  
  gl.bindTexture( gl.TEXTURE_2D, textures[dst] );

  display.render();

  // requestAnimFrame(render);
  window.setTimeout( render, 10 );
}

window.onload = init;
