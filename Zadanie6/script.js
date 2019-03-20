var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "void main(void) { \n"+
    "  gl_PointSize = 16.0; \n"+
    "  gl_Position = aVertexPosition + vec4(uMove, 0); \n"+
    "} \n";

var fragmentShaderSrc= ""+
    "precision mediump float; \n"+ 
    "uniform vec3 uColorRGB; \n"+ 
    "void main(void) { \n"+
    "  gl_FragColor = vec4(uColorRGB, 1.0); \n"+
    "} \n";

var gl; 
var glObjects; 
var html; 
var data;
var x = -0.99;
var y = 0.98;
var dx = 0.002;
var dy = -0.002;
var ballRadius = 0.1;
var brickRowCount = 4;
var brickColumnCount = 9;
var brickWidth = 0.2065;
var brickHeight = 0.16;
var brickPadding = 0.01;
var brickOffsetTop = 0.02;
var brickOffsetLeft = 0.02;
var score = 0;
var lives = 3;
var bricks = [];

/*
* RYSOWANIE OBIEKTÓW
*/
data = {};
data.object5 = [];
for(var c = 0; c < brickColumnCount; c++) {
    data.object5[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        data.object5[c][r] = {};
        data.object5[c][r].position = [0, 0, 0.2];
        data.object5[c][r].colorRGB = [0, 0, 0.55];
    }
}

var dataInit = function(){
    data.background = [0.52, 0.81, 0.92, 1];
    /*
    * PROSTOKĄT
    */
    data.object1 = {};
    data.object1.speed = 0.0008;
    data.object1.direction = [1, 0, 0];
    data.object1.position = [0, 0, 0];
    data.object1.colorRGB = [1.0, 0.0, 0.0];
    data.object1.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object1.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-0.15, -0.82,
        0.15, -0.82,
        -0.15, -0.89,
        -0.15, -0.89,
        0.15, -0.82,
        0.15, -0.89]), gl.STATIC_DRAW);
    data.object1.floatsPerVertex = 2;
    data.object1.NumberOfVertices = 6;
    data.object1.drawMode = gl.TRIANGLES;
    /*
    * KÓŁKO
    */
    data.object2 = {};
    data.object2.speed = 0.00075;
    data.object2.direction = [1, 0, 0];
    data.object2.position = [0, -0.77, 0.1];
    data.object2.colorRGB = [1, 1, 1];
    var circle = [];
    var degToRad = function(deg) {
        return deg * Math.PI / 180;
    }
    for(i = 0; i <= 360; i++) {
        var s = degToRad(i);
        var v1 = [Math.sin(s)*0.025, Math.cos(s)*0.05];
        var v2 = [0,0];
        circle = circle.concat(v1);
        circle = circle.concat(v2);
    }
    data.object2.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object2.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(circle), gl.STATIC_DRAW); 
    data.object2.floatsPerVertex = 2;
    data.object2.NumberOfVertices = circle.length/2;
    data.object2.drawMode = gl.TRIANGLE_STRIP;
    /*
    * CHMURY
    */
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            data.object5[c][r].bufferId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, data.object5[c][r].bufferId);
            var brickX = x + (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = y - (r * (brickHeight + brickPadding + 0.01)) - brickOffsetTop;
            gl.bufferData(gl.ARRAY_BUFFER, 
            new Float32Array([brickX, brickY,
            brickX, (brickY - brickHeight),
            (brickX + brickWidth), (brickY - brickHeight),
            (brickX + brickWidth), brickY]), gl.STATIC_DRAW); 
            data.object5[c][r].floatsPerVertex = 2;
            data.object5[c][r].NumberOfVertices = 4;
            data.object5[c][r].drawMode = gl.TRIANGLE_FAN;
        } 
    }
    /*
    * SŁOŃCE
    */
    data.object3 = {};
    data.object3.position = [0.1, 0.6, 0.7];
    data.object3.colorRGB = [1, 1, 0];
    var circles = [];
    var degToRads = function(degs) {
        return degs * Math.PI / 180;
    }
    for(i = 0; i <= 360; i++) {
        var ss = degToRads(i);
        var v1s = [Math.sin(ss)*0.07, Math.cos(ss)*0.14];
        var v2s = [0,0];
        circles = circles.concat(v1s);
        circles = circles.concat(v2s);
    }
    data.object3.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object3.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array(circles), gl.STATIC_DRAW ); 
    data.object3.floatsPerVertex = 2;
    data.object3.NumberOfVertices = circles.length/2;
    data.object3.drawMode = gl.TRIANGLE_STRIP;
    /*
    * TRAWA
    */
    data.object4 = {};
    data.object4.position = [0,0, 0.7];
    data.object4.colorRGB = [0.2, 0.8, 0.0];
    data.object4.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object4.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-1, -1,
        1, -1,
        -1, -0.85,
        -1, -0.85,
        1, -1,
        1, -0.85]), gl.STATIC_DRAW); 
    data.object4.floatsPerVertex = 2;
    data.object4.NumberOfVertices = 6;
    data.object4.drawMode = gl.TRIANGLES;
    data.animation = {};
    data.animation.requestId = 0;
    /*
    * GÓRY
    */
    data.object6 = {};
    data.object6.position = [0,0, 0.9];
    data.object6.colorRGB = [0.22, 0.22, 0.22];
    data.object6.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object6.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-1, -0.85,
        -0.5, 0.5,
        -0.2, -0.85,
        -0.65, -0.85,
        -0.1, 0.7,
        0.4, -0.85,
        -0.2, -0.85,
        0.45, 0.6,
        1, -0.85]), gl.STATIC_DRAW); 
    data.object6.floatsPerVertex = 2;
    data.object6.NumberOfVertices = 9;
    data.object6.drawMode = gl.TRIANGLES;
    /*
    * ŚNIEG
    */
    data.object7 = {};
    data.object7.position = [0, 0, 0.9];
    data.object7.colorRGB = [1, 1, 1];
    data.object7.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object7.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-0.585, 0.27,
        -0.5, 0.5,
        -0.445, 0.27,
        -0.279, 0.2,
        -0.1, 0.7,
        0.063, 0.2,
        0.28, 0.23,
        0.45, 0.6,
        0.59, 0.23]), gl.STATIC_DRAW); 
    data.object7.floatsPerVertex = 2;
    data.object7.NumberOfVertices = 9;
    data.object7.drawMode = gl.TRIANGLES;
    /*
    * DOM
    */
    data.object8 = {};
    data.object8.position = [0, 0, 0.9];
    data.object8.colorRGB = [1, 0.55, 0];
    data.object8.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object8.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-1, -0.45,
        -1, -0.85,
        -0.8, -0.85,
        -0.8, -0.45]), gl.STATIC_DRAW); 
    data.object8.floatsPerVertex = 2;
    data.object8.NumberOfVertices = 4;
    data.object8.drawMode = gl.TRIANGLE_FAN;
    /*
    * DACH
    */
    data.object9 = {};
    data.object9.position = [0, 0, 0.9];
    data.object9.colorRGB = [0.55, 0.28, 0.15];
    data.object9.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object9.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-1, -0.45,
        -0.9, -0.25,
        -0.8, -0.45]), gl.STATIC_DRAW); 
    data.object9.floatsPerVertex = 2;
    data.object9.NumberOfVertices = 3;
    data.object9.drawMode = gl.TRIANGLES;
    /*
    * OKNO
    */
    data.object10 = {};
    data.object10.position = [0, 0, 0.9];
    data.object10.colorRGB = [0.52, 0.81, 0.92];
    data.object10.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object10.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-0.97, -0.50,
        -0.97, -0.60,
        -0.83, -0.60,
        -0.83, -0.50]), gl.STATIC_DRAW); 
    data.object10.floatsPerVertex = 2;
    data.object10.NumberOfVertices = 4;
    data.object10.drawMode = gl.TRIANGLE_FAN;
    /*
    * DRZWI
    */
    data.object11 = {};
    data.object11.position = [0, 0, 0.9];
    data.object11.colorRGB = [0, 0, 0];
    data.object11.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object11.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 
        new Float32Array([-0.95, -0.85,
        -0.85, -0.85,
        -0.85, -0.65,
        -0.95, -0.65]), gl.STATIC_DRAW); 
    data.object11.floatsPerVertex = 2;
    data.object11.NumberOfVertices = 4;
    data.object11.drawMode = gl.TRIANGLE_FAN;

    data.animation = {};
    data.animation.requestId = 0;
}

var drawObject = function(obj) {
    gl.useProgram(glObjects.shaderProgram);
    gl.lineWidth(3);
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.bufferId ); 
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, obj.floatsPerVertex, gl.FLOAT, false, 0 , 0);
    gl.uniform3fv(glObjects.uMoveLocation, obj.position);
    gl.uniform3fv(glObjects.uColorRGBLocation, obj.colorRGB);
    gl.drawArrays(obj.drawMode, 0, obj.NumberOfVertices);
}

var redraw = function() {
    var bg = data.background;
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawObject(data.object1);
    drawObject(data.object2);
    drawObject(data.object3);
    drawObject(data.object4);
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            drawObject(data.object5[c][r]);
        }
    }
    drawObject(data.object6);
    drawObject(data.object7);
    drawObject(data.object8);
    drawObject(data.object9);
    drawObject(data.object10);
    drawObject(data.object11);
}

/*
* PORUSZANIE SIĘ I KOLIZJE 
*/
var animate = function(time) {
    var timeDelta = time - data.animation.lastTime;
    data.animation.lastTime = time;
    var x1 = data.object1.position[0] + data.object1.direction[0] * data.object1.speed * timeDelta;
    var x2 = data.object2.position[0] + data.object2.direction[0] * data.object2.speed * timeDelta;
    var y2 = data.object2.position[1] + data.object2.direction[1] * data.object2.speed * timeDelta;
    data.object1.position[0] = (x1 + 3) % 2 - 1;
    data.object2.position[0] = (x2 + 3) % 2 - 1;
    data.object2.position[1] = (y2 + 3) % 2 - 1;
    if(data.object1.position[0] < -0.85) {
        data.object1.direction = [1, 0];
    } else if (data.object1.position[0] > 0.85) {
        data.object1.direction = [-1, 0];
    }
    if(data.object2.position[0] + dx > 0.99) {
        dx = -dx;
        data.object2.direction[0] = -1;
        getRandomColor();
    } else if (data.object2.position[0] + dx < -0.99) {
        dx = -dx;
        data.object2.direction[0] = 1;
        getRandomColor();
    }
    if(data.object2.position[1] + dy > 0.95) {
        dy = -dy;
        data.object2.direction[1] = -1;
        getRandomColor();
    } else if(data.object2.position[1] + dy < -0.79) {
        if(data.object2.position[0] > data.object1.position[0] - 0.15 && data.object2.position[0] < data.object1.position[0] + 0.15) {
            dy = -dy;
            data.object2.direction[1] = 1;
            getRandomColor();
        } else {
            lives--;
            if(lives == 0) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                data.object1.position = [0, 0, 0];
                data.object2.position = [0, -0.77, 0.1];
                dx = 0.003;
                dy = -0.003;
            }
        }
    }
    if (data.object2.position[1] > 0.22) {
        for(var c = 0; c < brickColumnCount; c++) {
            for(var r = 0; r < brickRowCount; r++) {
                var brickX = x + (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = y - (r * (brickHeight + brickPadding + 0.01)) - brickOffsetTop;
                if(data.object5[c][r].position[2] == 0.2) {
                    if(data.object2.position[0] + ballRadius / 2 > brickX && 
                    data.object2.position[0] + ballRadius / 2 < brickX + brickWidth && 
                    data.object2.position[1] + ballRadius / 2 < brickY && 
                    data.object2.position[1] + ballRadius / 2 > brickY - brickHeight) {
                        dy = -dy;
                        if(data.object2.direction[1] == 1) {
                            data.object2.direction[1] = -1;
                        } else {
                            data.object2.direction[1] = 1;
                        }
                        getRandomColor();
                        data.object5[c][r].position[2] = 1;
                        data.object5[c][r].colorRGB = [0.52, 0.81, 0.92];
                        score++;
                        if(score == brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    };
    data.object2.position[0] += dx;
    data.object2.position[1] += dy;
    redraw();
    gl.finish();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStart = function() {
    data.animation.lastTime = window.performance.now();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStop =  function() {
    if (data.animation.requestId)
    window.cancelAnimationFrame(data.animation.requestId);
    data.animation.requestId = 0;
    redraw();
}

var htmlInit= function() {
    html = {};
    html.html = document.querySelector('#htmlId');
    html.canvas = document.querySelector('#canvasId');
};

var glInit= function(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    glObjects = {}; 
    glObjects.shaderProgram = compileAndLinkShaderProgram(gl, vertexShaderSrc, fragmentShaderSrc);
    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, "aVertexPosition");
    glObjects.uMoveLocation = gl.getUniformLocation(glObjects.shaderProgram, "uMove");
    glObjects.uColorRGBLocation = gl.getUniformLocation(glObjects.shaderProgram, "uColorRGB");
};

var compileAndLinkShaderProgram = function (gl, vertexShaderSource, fragmentShaderSource ){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        console.log(gl);
        return null;
    }
    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
        console.log(gl);
        return null;
    }
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
        console.log(gl);
        return null;
    }
    return shaderProgram;
};

/*
* LOSOWA WARTOŚĆ LICZBY I KOLORU
*/
function getRandomColor() {
    var x = (Math.random() * (0.99 - 0.01) + 0.01).toFixed(4);
    var y = (Math.random() * (0.99 - 0.01) + 0.01).toFixed(4);
    var z = (Math.random() * (0.99 - 0.01) + 0.01).toFixed(4);
    var v = data.object2.colorRGB = [x, y, z];
    return v;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

/*
* PORUSZANIE SIĘ
*/
var callbackOnKeyDown = function (e) {
    var i = 0;
    var r = getRandomInt(2);
    if(r == 0) {
        r = -1;
    }
    var code = e.which || e.keyCode;
    switch(code) {
        case 37: // lewo
        case 74: // J
            data.object1.direction = [-1,0];
            break;
        case 39: // prawo
        case 76: // L
            data.object1.direction = [1,0];
            break;
        case 32: // spacja
            if(i == 0) {
                data.object2.direction = [r, -1];
            }
            if(data.animation.requestId == 0) {
                animationStart();
            } else {
                animationStop();
            } 
            i++;
            break;
    }
}

window.onload = function(){
    htmlInit();
    glInit(html.canvas);
    dataInit();
    redraw(); 
    window.onkeydown = callbackOnKeyDown;
};