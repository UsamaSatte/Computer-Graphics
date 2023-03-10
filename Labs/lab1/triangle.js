"use strict";

var gl;
var points;
var points2;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

     points = new Float32Array([
       -0.5, -0.5,
          0,  1 ,
          0, 0,
          0, 0 ,
          1, 1 ,
          1.5, 0.5]);

//  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer    

    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(aPosition );
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    //repeat for second triangle
    var program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
    gl.useProgram( program2 );

    var bufferId2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    var bPosition = gl.getAttribLocation( program2, "bPosition" );
    gl.vertexAttribPointer(bPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(bPosition );
    gl.drawArrays( gl.TRIANGLES, 3, 3 );
	

}