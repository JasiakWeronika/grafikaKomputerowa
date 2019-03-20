"use strict";

var canvas = document.getElementById('myGraphic');

var color = {
    red: "#ff0000",
    orange: "#ffa500",
    green: "#00ff00",
    darkgreen: "#006400",
    blue: "#0000ff",
    darkblue: "#00008b",
    yellow: "#ffff00",
    magenta: "#ff00ff",
    cyan: "#00ffff",
    pink: "#ffc0cb",
    purple: "#a020f0",
    brown: "#a52a2a",
};

var turtle = {
    x: canvas.width / 2,
    y: canvas.height / 2,
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

turtle.polygon = function(numberofsides) {
    turtle.lineWidth = 1;
    var sidelength = 50;
    var angle = 360 / numberofsides; 
    for (var i = 0; i < 200; i++) {
      turtle.penColor = turtle.getRandomColor();
      turtle.forward(sidelength);
      turtle.right(angle);
    }
};

turtle.star = function () {
    turtle.penColor = color.blue;
    for (var i = 0; i < 200; i++) {
        turtle.forward(200);
        turtle.right(144);
    }
};

turtle.stars = function () {
    turtle.penColor = color.red;
    for (var i = 0; i < 50; i++) {
        turtle.forward(i * 10);
        turtle.right(144);
    }
};

turtle.sun = function () {
    turtle.penColor = color.yellow;
    for (var i = 0; i < 18; i++) {
        turtle.left(100);
        turtle.forward(150);
    }
};

turtle.something = function () {
    turtle.penColor = color.magenta;
    for (var i = 0; i < 360; i++) {
        turtle.forward(i);
        turtle.right(320); 
    }
};

function check(value) {
    switch (value) {
        case "1":
        turtle.star();
        break;
        case "2":
        turtle.stars();
        break;
        case "3":
        turtle.sun();
        break;
        case "4":
        turtle.something();
        break;
      }
};

document.getElementById('clickMe').onclick = function () {
    var n = document.getElementById("value").value;
    turtle.polygon(n);
}

document.getElementById('clean').onclick = function() {
    turtle.animal.clearRect(0, 0, canvas.width, canvas.height);
    turtle.x = canvas.width / 2;
    turtle.y = canvas.height / 2;
    turtle.angleInRadians = 0;
}