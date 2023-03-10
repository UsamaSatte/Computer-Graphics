"use strict";

var canvas;
var gl;

var numPositions  = 36;
var u_time = 0.0;
var positions = [];
var colors = [];

var theta = [0, 0, 0];
var thetaLoc;

init();

function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);


    thetaLoc = gl.getUniformLocation(program, "uTheta");

    

    render();
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

function quad(a, b, c, d)
{
    var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4(0.5,  0.5,  0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(0.5,  0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    //vertex color assigned by the index of the vertex
    var indices = [a, b, c, a, c, d];


    //You'll want some different colours in here

    var vertexColors = [
       vec4(0.0, 0.0, 0.0, 1.0), // black
       vec4(1.0, 0.0, 0.0, 1.0), // red
       vec4(1.0, 1.0, 0.0, 1.0), // yellow
       vec4(0.0, 1.0, 0.0, 1.0), // green
       vec4(0.0, 0.0, 1.0, 1.0), // blue
       vec4(1.0, 0.0, 1.0, 1.0), // magenta
       vec4(0.0, 1.0, 1.0, 1.0), // cyan
       vec4(1.0, 1.0, 1.0, 1.0)  // white
       ];
      
    // End of setting colours


    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex
  

    for ( var i = 0; i < indices.length; ++i ) {
      positions.push( vertices[indices[i]] );
      //colors.push( vertexColors[indices[i]] );
      // for solid colored faces use
       colors.push(vertexColors[a]);
      
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //I used 0.25 since it was tolerable on my machine, there's no other reason for it

    theta[0] += 0.25;
    theta[1] += 0.25;
    theta[2] += 0.25;
    console.log(theta);
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}