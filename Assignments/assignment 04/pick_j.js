"use strict";

var canvas;
var gl;

var numPositions  = 12;
var numPositions2 = 18;
var numPositions3 = 36;

var positions = [];
var colors = [];
var color = new Uint8Array(4);

var theta = [0,0,0];
var theta2 = [0,0,0];
var theta3 = [0,0,0];

var thetaLoc;
var thetaLoc2;
var thetaLoc3;
//var elt;

var program, program2, program3;

var t_vert = [
  vec3(0.0, 0.0,0.5),
  vec3(0.5,0.5,0.0),
  vec3(0.5,-0.5,0.0),
  vec3(-0.5,0.5,0.0)
];

var t_col = [
  vec4(0.0,1.0,1.0,1.0),
  vec4(0.0,1.0,0.3,0.6),
  vec4(1.0,1.0,1.4,0.2),
  vec4(0.0,0.5,0.0,0.1)
];

var t_ind = [
  0,1,3,
  2,3,1,
  0,1,3,
  3,2,0
];

var s_vert = [  
  vec3(0.0, 0.0,0.5),
  vec3(0.5,0.5,0.0),
  vec3(0.5,-0.5,0.0),
  vec3(-0.5,0.5,0.0)];

  var s_col = [
    vec4(1.0,1.0,1.0,1.0),
    vec4(0.0,0.0,0.0,0.6),
    vec4(1.0,0.0,1.0,0.2),
    vec4(0.5,0.0,0.0,0.1)
  ];

  var s_ind = [
    0,1,2,
    2,4,0,
    0,4,3,
    3,1,0,
    3,1,2,
    2,3,4
  ];

  var vertices = [
  vec3(0, 0,  0.5),
  vec3(0, 0, 0.5),
  vec3(0, 0,  0.5),
  vec3(0, 0,  0.5),
  vec3(-0.5, -0.5, -0.5),
  vec3(-0.5,  0.5, -0.5),
  vec3(0.5,  0.5, -0.5),
  vec3(0.5, -0.5, -0.5)
];

var vertexColors = [
    vec4(1.0, 0.5, 0.0, 1.0),  // black
    vec4(1.0, 0.5, 0.0, 1.0),  // red
    vec4(1.0, 0.0, 0.0, 1.0),  // yellow
    vec4(1.0, 1.5, 1.0, 1.0),  // green
    vec4(1.0, 1.5, 0.0, 1.0),  // blue
    vec4(1.0, 1.0, 1.0, 1.0),  // magenta
    vec4(1.0, 1.0, 0.0, 1.0),  // cyan
    vec4(1.0, 1.0, 0.0, 1.0)   // white
];    

var indices=[
  1,0,3,
  3,2,1,
  2,3,7,
  7,6,2,
  3,0,4,
  4,7,3,
  6,5,1,
  1,2,6,
  4,5,6,
  6,7,4,
  5,4,0,
  0,1,5
];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //elt = document.getElementById("test");

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    program3 = initShaders( gl, "vertex-shader3", "fragment-shader3" );

    canvas.addEventListener("mousedown", function(event){

      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.clear( gl.COLOR_BUFFER_BIT);
      gl.uniform3fv(thetaLoc, theta);
      for(var i=0; i<6; i++) {
          gl.uniform1i(gl.getUniformLocation(program, "uColorIndex"), 1);
          gl.uniform4fv(gl.getUniformLocation(program, "uFalseColor"), flatten(colors[i]));
          gl.drawArrays(gl.TRIANGLES, 6*i, 6);
      }
      var x = event.clientX;
      var y = canvas.height-event.clientY;

      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);

      if(color[0]==255)
      if(color[1]==255) elt.innerHTML = "<div> front </div>";
      else if(color[2]==255) elt.innerHTML = "<div> back </div>";
      else elt.innerHTML = "<div> right </div>";
      else if(color[1]==255)
      if(color[2]==255) elt.innerHTML = "<div> left </div>";
      else elt.innerHTML = "<div> top </div>";
      else if(color[2]==255) elt.innerHTML = "<div> bottom </div>";
      else elt.innerHTML = "<div> background </div>";

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.uniform1i(gl.getUniformLocation(program, "uColorIndex"), 0);
      gl.clear( gl.COLOR_BUFFER_BIT );
      gl.uniform3fv(thetaLoc, theta);
      gl.drawArrays(gl.TRIANGLES, 0, numPositions);

  });

    render();

}

function p1(){
  // array element buffer
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(t_ind), gl.STATIC_DRAW);

    // color array atrribute buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(t_col), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor");
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    //vertex element buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(t_vert), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");
  }

  function p2() { 
    // array element buffer
    var iBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(s_ind), gl.STATIC_DRAW);

    // color array atrribute buffer
    var cBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(s_col), gl.STATIC_DRAW);
    
    var colorLoc2 = gl.getAttribLocation( program2, "aColor2");
    gl.vertexAttribPointer( colorLoc2, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc2 );
    
    //vertex element buffer
    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(s_vert), gl.STATIC_DRAW);

    var positionLoc2 = gl.getAttribLocation( program2, "aPosition2");
    gl.vertexAttribPointer(positionLoc2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2 );

    

    thetaLoc2 = gl.getUniformLocation(program2, "uTheta2");
  }

function p3() {
  // array element buffer
    var iBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer
    var cBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
    
    var colorLoc3 = gl.getAttribLocation( program3, "aColor3");
    gl.vertexAttribPointer( colorLoc3, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc3 );

    //vertex element buffer 
    var vBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var positionLoc3 = gl.getAttribLocation( program3, "aPosition3");
    gl.vertexAttribPointer(positionLoc3, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc3 );  

    thetaLoc3 = gl.getUniformLocation(program3, "uTheta3");
  }
    
      

function render()
{
  gl.useProgram(program);
  p1();
    theta[0] += 0.5;
    theta[1] += 0.5;
    theta[2] += 0.5;
    gl.uniform3fv(thetaLoc,theta);
    gl.drawElements(gl.TRIANGLES, numPositions, gl.UNSIGNED_BYTE,0);

  gl.useProgram(program2);
  p2();
    theta2[0] += 0.5;
    theta2[1] += 0.5;
    theta2[2] += 0.5;
    gl.uniform3fv(thetaLoc2,theta2);
    gl.drawElements(gl.TRIANGLES, numPositions2, gl.UNSIGNED_BYTE,0);

  gl.useProgram(program3);
  p3();
    theta3[0] += 0.5;
    theta3[1] += 0.5;
    theta3[2] += 0.5;
    gl.uniform3fv(thetaLoc3,theta3);
    gl.drawElementsInstanced(gl.TRIANGLES, numPositions3, gl.UNSIGNED_BYTE, 0, 1);

  requestAnimationFrame( render );
}