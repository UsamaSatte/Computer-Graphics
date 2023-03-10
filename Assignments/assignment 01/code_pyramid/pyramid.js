"use strict";
var gl;
var theta = 0.0;
var thetaLoc;
var speed = 100;
var direction = true;
var positions = [];
var colors = [];


window.onload = function init()
{
   var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

            //  Configure WebGL
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(1.0, 1.0, 1.0, 1.0);

                 //  Load shaders and initialize attribute buffers
     var program = initShaders(gl, "vertex-shader", "fragment-shader");
     gl.useProgram(program);

    var vertices = [
        vec3(0.0000,  0.0000, -1.0000),
        vec3(0.0000,  0.9428,  0.3333),
        vec3(-0.8165, -0.4714,  0.3333),
        vec3(0.8165, -0.4714,  0.3333)
    ];

    pyramidSidesClr(vertices[0], vertices[1], vertices[2], vertices[3])

    // enable hidden-surface removal

    gl.enable(gl.DEPTH_TEST);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    document.getElementById("Direction").onclick = function (event) {
        direction = !direction;
    };

    document.getElementById("slider").onchange = function(event) {
        speed = 100 - event.target.value;
    };

    document.getElementById("Controls" ).onclick = function(event) {
        switch(event.target.index) {
          case 0:
            direction = !direction;
            break;
         case 1:
            speed /= 2.0;
            break;
         case 2:
            speed *= 2.0;
            break;
       }
    };

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
          case '1':
            direction = !direction;
            break;

          case '2':
            speed /= 2.0;
            break;

          case '3':
            speed *= 2.0;
            break;
        }
    };

    render();
};

function triangle( a, b, c, color )
{

    // add colors and vertices for one triangle

    var baseColors = [
        vec3(1.0, 1.0, 0.0),
        vec3(0.0, 1.0, 1.0),
        vec3(0.0, 0.0, 1.0),
        vec3(1.0, 0.0, 0.0)
    ];

    colors.push(baseColors[color]);
    positions.push(a);
    colors.push(baseColors[color]);
    positions.push(b);
    colors.push(baseColors[color]);
    positions.push(c);
}

function pyramidSidesClr( a, b, c, d )
{
    triangle(a, c, b, 0);
    triangle(a, c, d, 1);
    triangle(a, b, d, 2);
    triangle(b, c, d, 3);
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    theta += (direction ? 0.1 : -0.1);
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length);

    setTimeout(
        function (){requestAnimationFrame(render);}, 
        speed
    );
}