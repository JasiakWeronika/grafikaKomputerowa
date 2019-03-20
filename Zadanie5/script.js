"use strict";

var canvas = document.getElementById('graphic');

var gl = canvas.getContext('experimental-webgl');

var vertices = [
   -0.7,-0.1,0,
   -0.3,0.6,0,
   -0.3,-0.3,0,
   0.2,0.6,0,
   0.3,-0.3,0,
   0.7,0.6,0 
]

var vertex_buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

var vertCode =
   'attribute vec4 coordinates;' + 
   'uniform vec4 translation;'+
   'void main(void) {' +
      'gl_Position = coordinates + translation;' +
      'gl_PointSize = 10.0;'+
   '}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

var fragCode =
   'void main(void) {' +
      'gl_FragColor = vec4(0, 0, 0, 1);' +
   '}';
   
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderProgram = gl.createProgram();

gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

var coord = gl.getAttribLocation(shaderProgram, "coordinates");

gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

var Tx = -0.1, Ty = -0.1, Tz = 0.0;
var translation = gl.getUniformLocation(shaderProgram, 'translation');

gl.uniform4f(translation, Tx, Ty, Tz, 0.0);

gl.clearColor(1, 1, 1, 1);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);

function attributes() {
  const numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
   for (let i = 0; i < numAttribs; ++i) {
      const info = gl.getActiveAttrib(shaderProgram, i); 
      console.log('name:', info.name, 'type:', info.type, 'size:', info.size); 
   } 
}

function uniforms() {
   const numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
   for (let i = 0; i < numUniforms; ++i) {
      const info = gl.getActiveUniform(shaderProgram, i);
      console.log('name:', info.name, 'type:', info.type, 'size:', info.size);
   }
}

document.getElementById('points').onclick = function() {
   gl.drawArrays(gl.POINTS, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('line_strip').onclick = function() {
   gl.drawArrays(gl.LINE_STRIP, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('line_loop').onclick = function() {
   gl.drawArrays(gl.LINE_LOOP, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('lines').onclick = function() {
   gl.drawArrays(gl.LINES, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('triangle_strip').onclick = function() {
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('triangle_fan').onclick = function() {
   gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('triangles').onclick = function() {
   gl.drawArrays(gl.TRIANGLES, 0, 6);
   attributes();
   uniforms();
}

document.getElementById('clean').onclick = function() {
   gl.clearColor(1, 1, 1, 1);
   gl.enable(gl.DEPTH_TEST);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}