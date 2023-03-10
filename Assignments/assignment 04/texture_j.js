"use strict";

var canvas;
var gl;

var numPositions  = 36;

var texSize = 64;

var program;
var flag = true;

var positionsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(-0.5,  0.5, 0.5, 1.0),
    vec4(0.5,  0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(0.5,  0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // white
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = vec3(45.0, 45.0, 45.0);

var thetaLoc;

// triangle vertices

var positionsArray = [
  vec2(-0.5, -0.5),
  vec2(0, 0.5),
  vec2(0.5, -0.5)
];

function quad(a, b, c, d) {
  positionsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  positionsArray.push(vertices[b]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[1]);

  positionsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  positionsArray.push(vertices[a]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[0]);

  positionsArray.push(vertices[c]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[2]);

  positionsArray.push(vertices[d]);
  colorsArray.push(vertexColors[a]);
  texCoordsArray.push(texCoord[3]);
}


function colorCube()
{
 quad(1, 0, 3, 2);
 quad(2, 3, 7, 6);
 quad(3, 0, 4, 7);
 quad(6, 5, 1, 2);
 quad(4, 5, 6, 7);
 quad(5, 4, 0, 1);
}


var program;
var texture1;

var framebuffer, renderbuffer;


window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


// Create an empty texture

texture1 = gl.createTexture();
gl.activeTexture( gl.TEXTURE0 );
gl.bindTexture( gl.TEXTURE_2D, texture1 );
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

gl.bindTexture(gl.TEXTURE_2D, null);

// Allocate a frame buffer object

 framebuffer = gl.createFramebuffer();
 gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer);

 renderbuffer = gl.createRenderbuffer();
 gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

// Attach color buffer


 gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);


// check for completeness

 var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
 if(status != gl.FRAMEBUFFER_COMPLETE) alert('Frame Buffer Not Complete');

  gl.useProgram(program1);


  // Create and initialize a buffer object with triangle vertices

  var buffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

  // Initialize the vertex position attribute from the vertex shader

  var positionLoc = gl.getAttribLocation(program1, "aPosition");
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray(positionLoc);

  // Render one triangle

  gl.viewport(0, 0, 64, 64);
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 3);


  // Bind to window system frame buffer, unbind the texture

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);


  gl.disableVertexAttribArray(positionLoc);

  gl.useProgram(program2);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // send data to GPU for normal render


  var buffer2 = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, buffer2);
  gl.bufferData(gl.ARRAY_BUFFER,   new flatten(vertices), gl.STATIC_DRAW);

  var positionLoc = gl.getAttribLocation( program2, "aPosition");
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);


  var buffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);


  var texCoordLoc = gl.getAttribLocation( program2, "aTexCoord");
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray(texCoordLoc);

  gl.uniform1i( gl.getUniformLocation(program2, "uTextureMap"), 0);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.viewport(0, 0, 512, 512);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}