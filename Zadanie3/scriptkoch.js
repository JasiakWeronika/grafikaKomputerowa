"use strict";

var svg = document.getElementById("notFun");
var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

var turtle = {
    x: 100,
    y: 200,
    angleInRadians: 0,
};

turtle.forward = function (length) {
    this.x += length * Math.cos(this.angleInRadians);
    this.y += length * Math.sin(this.angleInRadians);
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

turtle.draw = function(length, depth) {
    svg.appendChild(polygon);
    var arrayX = new Array();
    var arrayY = new Array();
    turtle.koch = function (length, depth) {
            if (depth == 0) {
            turtle.forward(length);
            arrayX.push(this.x);
            arrayY.push(this.y);
            console.log(arrayX + " " + arrayY);
        } else {
            turtle.koch(length / 3, depth - 1);
            turtle.right(60);
            turtle.koch(length / 3, depth - 1);
            turtle.left(120);
            turtle.koch(length / 3, depth - 1);
            turtle.right(60);
            turtle.koch(length / 3, depth - 1);   
        }
    }
    turtle.snow = function (length, depth) {
        for (var i = 0; i < 3; i++) {
            turtle.koch(length, depth);
            turtle.left(120);
        }
        turtle.winter(length);
    }
    turtle.winter = function (length) {
        for (var i = 0; i < arrayX.length; i++) {
            var point = svg.createSVGPoint();
            point.x = arrayX[i];
            point.y = arrayY[i];
            polygon.points.appendItem(point);
        }
    }
    turtle.snow(length, depth);
};

document.getElementById('showMe').onclick = function() {
    var l = document.getElementById("length").value;
    var d = document.getElementById("depth").value;
    turtle.draw(l, d);
}

document.getElementById('clean').onclick = function() {
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
}
