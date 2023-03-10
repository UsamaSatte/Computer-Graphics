"use strict";

var canvas;
var gl;

var theta = [0, 0, 0]; //x, y, z rotation
var thetaLoc;

var near = 0.3;
var far = 10.0; 
var radius = 4.0;
var theta2 = 0.0; // you already have a theta, you should rename that
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;

var CTMLoc;
var CTM = mat4(1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0);

var numElements = 36;
var numInstances = 27;

    var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  0.5),
        vec3(0.5,  0.5,  0.5),
        vec3(0.5, -0.5,  0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5,  0.5, -0.5),
        vec3(0.5,  0.5, -0.5),
        vec3(0.5, -0.5, -0.5)
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 1.0, 1.0, 1.0)   // cyan
    ];

// indices of the 12 triangles that compise the cube

var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

init();

function init()
{
    canvas = document.getElementById("gl-canvas");
    aspect =  canvas.width/canvas.height;

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    
    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    CTMLoc = gl.getUniformLocation(program,"uCTM");


    //event listeners for buttons
    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){theta2 += dr;};
    document.getElementById("Button6").onclick = function(){theta2 -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[0] += 0.1;
    theta[1] += 0.1;
    theta[2] +=-0.1;

    gl.uniform3fv(thetaLoc, theta);

    eye = vec3(radius*Math.sin(theta2)*Math.cos(phi),
    radius*Math.sin(theta2)*Math.sin(phi), radius*Math.cos(theta2));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    CTM = mult(projectionMatrix, mult(modelViewMatrix, mult(scale , mult(rz , mult(ry, rx)))));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(CTMLoc, false, flatten(CTM));

    gl.drawElementsInstanced(gl.TRIANGLES, numElements, gl.UNSIGNED_BYTE, 0, numInstances);
    requestAnimationFrame(render);
}