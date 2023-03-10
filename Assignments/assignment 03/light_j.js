"use strict";

var canvas;
var gl;
var index = 0;
var positionsArray = [];
var normalsArray = [];



var tvertex = [
    vec3(0.0, 0.0, 0.5),
    vec3(0.5, 0.5, 0.0),
    vec3(0.5, -0.5, 0.0),
    vec3(-0.5, 0.5, 0.0)
];
var tcolor = [
vec4(1.0, 0.0, 0.0, 1.0),
vec4(1.0, 0.0, 0.0, 0.8),
vec4(1.0, 0.0, 0.0, 0.6),
vec4(1.0, 0.0, 0.0, 0.4)
];
var tindices = [
    0, 1, 2,
    2, 3, 1,
    0, 1, 3,
    3, 2, 0
];



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
    vec4(0.2, 0.0, 1.0, 1.0),
    vec4(0.4, 0.0, 1.0, 1.0),
    vec4(0.6, 0.0, 1.0, 1.0),
    vec4(0.8, 0.0, 1.0, 1.0),
    vec4(1.0, 0.0, 0.8, 1.0),
    vec4(1.0, 0.0, 0.6, 1.0),
    vec4(1.0, 0.0, 0.4, 1.0),
    vec4(1.0, 0.0, 0.2, 1.0)
];
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



var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 20.0;

var angles = theta[0]*Math.PI/180;;
var c = cos(angles);
var s = sin(angles);

// Remeber: thse matrices are column-major
var rx = mat4(1.0,  0.0,  0.0, 0.0,
        0.0,  c.x,  s.x, 0.0,
        0.0, -s.x,  c.x, 0.0,
        0.0,  0.0,  0.0, 1.0);

var ry = mat4(c.y, 0.0, -s.y, 0.0,
        0.0, 1.0,  0.0, 0.0,
        s.y, 0.0,  c.y, 0.0,
        0.0, 0.0,  0.0, 1.0);

var rz = mat4(c.z, s.z, 0.0, 0.0,
        -s.z,  c.z, 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        0.0,  0.0, 0.0, 1.0);

var scale = mat4(0.2, 0.0, 0.0, 0.0,
            0.0, 0.2, 0.0, 0.0,
            0.0, 0.0, 0.2, 0.0,
            0.0, 0.0, 0.0, 1.0);

var trans = mult(scale,mult(rz,mult(ry,rx)));

var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var nMatrix, nMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

const head = new shape();
const body = new shape();
const left_arm = new shape();
const right_arm = new shape();

class shape {
    constructor(program, vertices, indices, vertexColors, positionLoc, colorLoc, theta, thetaLoc){ 
        this.program = program;
        this.vertices = vertices;
        this.indices = indices;
        this.vertexColors = vertexColors;
        this.positionLoc = positionLoc;
        this.colorLoc = colorLoc;
        this.theta = theta;
        this.thetaLoc = thetaLoc;
    }  
    init(){
        var iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
    
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

        var nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    }
    draw(){
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        modelViewMatrix = lookAt(eye, at , up);
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    
        nMatrix = normalMatrix(modelViewMatrix, true );
    
        thetaLoc = gl.getUniformLocation(program, "uTheta");
        modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
        nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");

        var ctm = mult(modelViewMatrix, mult(projectionMatrix, trans));
        gl.uniform4fv(gl.getUniformLocation(program,
            "uAmbientProduct"),flatten(ambientProduct));
         gl.uniform4fv(gl.getUniformLocation(program,
            "uDiffuseProduct"),flatten(diffuseProduct));
         gl.uniform4fv(gl.getUniformLocation(program,
            "uSpecularProduct"),flatten(specularProduct));
         gl.uniform4fv(gl.getUniformLocation(program,
            "uLightPosition"),flatten(lightPosition));
         gl.uniform1f(gl.getUniformLocation(program,
            "uShininess"),materialShininess);

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix) );

        

        for( var i=0; i<index; i+=3)
            gl.drawArrays( gl.TRIANGLES, i, 3 );
    
        requestAnimationFrame(render);
    }
}

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    var colorLoc = gl.getAttribLocation(program, "aColor");
    var positionLoc = gl.getAttribLocation( program, "aPosition");
    var normalLoc = gl.getAttribLocation(program, "aNormal");

    document.getElementById("ButtonA").onclick = function(){radius *= 2.0;};
    document.getElementById("ButtonB").onclick = function(){radius *= 0.5;};
    document.getElementById("ButtonC").onclick = function(){theta += dr;};
    document.getElementById("ButtonD").onclick = function(){theta -= dr;};
    document.getElementById("ButtonE").onclick = function(){phi += dr;};
    document.getElementById("ButtonF").onclick = function(){phi -= dr;};

    head = new shape(program, vertices, indices, vertexColors, colorLoc, positionLoc);
    head.init();
    head.draw();

    character = new shape(program, vertices, indices, vertexColors, colorLoc, positionLoc);
    character.init();
    character.draw();

    left_arm = new shape(program, vertices, indices, vertexColors, colorLoc, positionLoc);
    left_arm.init();
    left_arm.draw();

    right_arm = new shape(program, vertices, indices, vertexColors, colorLoc, positionLoc);
    right_arm.init();
    right_arm.draw();

    document.getElementById("sliderA").onchange = function(event) {
        theta[0] = event.target.value;
    };
    document.getElementById("sliderB").onchange = function(event) {
         theta[1] = event.target.value;
    };

    render();
}
function render() {
   
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
    radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
}