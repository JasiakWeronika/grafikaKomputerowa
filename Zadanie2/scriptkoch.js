"use strict";

var canvas = document.getElementById('myGraphic');

var turtle = {
    x: 100,
    y: 200,
    angleInRadians: 0,
    penDown: true,
    penColor: "#000000",
    lineWidth: 2
};

if (canvas && canvas.getContext) { 
    turtle.animal = canvas.getContext("2d"); 
} else {
    alert('You need a browser which supports the HTML5 canvas!');
}

turtle.logPenStatus = function () {
    console.log('x=' + this.x + "; y=" + this.y + '; angle = ' + this.angle + '; penDown = ' + this.penDown);
};

turtle.forward = function (length) {
    var x0 = this.x,
        y0 = this.y;
    this.x += length * Math.cos(this.angleInRadians);
    this.y += length * Math.sin(this.angleInRadians);
    if (this.animal) {
        if (this.penDown) {
            this.animal.beginPath();
            this.animal.lineWidth = this.lineWidth;
            this.animal.strokeStyle = this.penColor;
            this.animal.moveTo(x0, y0);
            this.animal.lineTo(this.x, this.y);
            this.animal.stroke();
        }
    } else {
        this.animal.moveTo(this.x, this.y);
    }
    return this;
};

turtle.backward = function (length) {
    this.forward(-length);
    return this;
};

turtle.left = function (angleInDegrees) {
    this.angleInRadians += angleInDegrees * Math.PI / 180.0;
    return this;
};

turtle.right = function (angleInDegrees) {
    this.left(-angleInDegrees);
    return this;
};

turtle.angle = function () {
    return this.angleInRadians * 180.0 / Math.PI;
};

turtle.getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

turtle.koch = function(length, depth) {
    if (depth == 0) {
        turtle.penColor = turtle.getRandomColor();
        turtle.forward(length);
    } else {
        turtle.penColor = turtle.getRandomColor();
        turtle.koch(length / 3, depth - 1);
        turtle.penColor = turtle.getRandomColor();
        turtle.right(60);
        turtle.penColor = turtle.getRandomColor();
        turtle.koch(length / 3, depth - 1);
        turtle.penColor = turtle.getRandomColor();
        turtle.left(120);
        turtle.penColor = turtle.getRandomColor();
        turtle.koch(length / 3, depth - 1);
        turtle.penColor = turtle.getRandomColor();
        turtle.right(60);
        turtle.penColor = turtle.getRandomColor();
        turtle.koch(length / 3, depth - 1);   
        turtle.penColor = turtle.getRandomColor();
    }
};

document.getElementById('showMe').onclick = function() {
    var l = document.getElementById("length").value;
    var d = document.getElementById("depth").value;
    var i = 0;
    while (i < 3) {
        turtle.koch(l, d);
        turtle.left(120);
        i++;
    }
}

document.getElementById('clean').onclick = function() {
    turtle.animal.clearRect(0, 0, canvas.width, canvas.height);
    turtle.x = canvas.width / 10;
    turtle.y = canvas.height / 3;
    turtle.angleInRadians = 0;
}