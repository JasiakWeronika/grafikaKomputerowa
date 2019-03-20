var container;
var dx;
var dy;
var cubes = [];
var map = [];
var main_camera;
var score = 0;
onkeypress = onKeyPressed;

class cube {
    constructor(center, size) {
        const d = size / 2;
        this.vertices = [
            new point3(center.x - d, center.y - d, center.z + d),
            new point3(center.x - d, center.y - d, center.z - d),
            new point3(center.x + d, center.y - d, center.z - d),
            new point3(center.x + d, center.y - d, center.z + d),
            new point3(center.x + d, center.y + d, center.z + d),
            new point3(center.x + d, center.y + d, center.z - d),
            new point3(center.x - d, center.y + d, center.z - d),
            new point3(center.x - d, center.y + d, center.z + d)
        ];
        this.edges = [
            [this.vertices[0], this.vertices[1]], [this.vertices[1], this.vertices[2]],
            [this.vertices[2], this.vertices[3]], [this.vertices[3], this.vertices[0]],
            [this.vertices[7], this.vertices[6]], [this.vertices[6], this.vertices[5]],
            [this.vertices[5], this.vertices[4]], [this.vertices[4], this.vertices[7]],
            [this.vertices[7], this.vertices[0]], [this.vertices[4], this.vertices[3]],
            [this.vertices[5], this.vertices[2]], [this.vertices[6], this.vertices[1]]
        ];
    }
    render(container, dx, dy) {
        for(let i = 0; i < this.edges.length; i++) {
            var begin = project(this.edges[i][0]);
            var end = project(this.edges[i][1]);
            container.innerHTML += line(begin.x + dx, begin.y + dy, end.x + dx, end.y + dy, '#0F0', '2px');
        }
    }
}

class edge {
    constructor(start, end, col) {
        this.vertices = [
            start,
            end
        ];
        this.color = col;
    }
    render() {
        var begin = project(this.vertices[0]);
        var end = project(this.vertices[1]);
        container.innerHTML += line(begin.x + dx, begin.y + dy, end.x + dx, end.y + dy, this.color, '2px');
    }
}

class point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class point3 extends point2 {
    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }
}

function main() {
    container = document.getElementById('svg_canvas');
    dx = container.attributes.width.value/2;
    dy = container.attributes.height.value/2;
    main_camera = new point3(0, 0, 0);
    cubes = generate_cubes();
    generateMap();
    repaint();
};

function onKeyPressed(e) {
    e.preventDefault();
    const code = e.which || e.keyCode;
    switch(code) {
        case 119: // W
            move(2);
            repaint();
            break;
        case 97: // A
            move(1);
            repaint();
            break;
        case 100: // D
            move(0);
            repaint();
            break;
    };
};

function move(val) {
    if(val == 1) {
        for(let i = 0; i < cubes.length; i++) {
            for(let j = 0; j < cubes[i].vertices.length; j++) {
                cubes[i].vertices[j].x += 10;
            }
        }

        for(let i = 0; i < map.length-1; i++) {
            map[i].vertices[0].x += 10;
            map[i].vertices[1].x += 10;
        }
    } else if(val == 0) {
        for(let i = 0; i < cubes.length; i++) {
            for(let j = 0; j < cubes[i].vertices.length; j++) {
                cubes[i].vertices[j].x -= 10;
            }
        }
        for(let i = 0; i < map.length-1; i++) {
            map[i].vertices[0].x -= 10;
            map[i].vertices[1].x -= 10;
        }
    } else {
        for(let i = 0; i < cubes.length; i++) {
            for(let j = 0; j < cubes[i].vertices.length; j++) {
                cubes[i].vertices[j].z -= 10;
            }
            if(cubes[i].vertices[0].z < 10) {
                if(cubes[i].vertices[0].x > -10 && cubes[i].vertices[2].x < 10) {
                    score--;
                } else {
                    score++;
                }
                var size = 10;
                var x;
                var rand = Math.floor(Math.random()*10)%3;
                if(rand == 0) {
                    x = 0;
                } else if(rand == 1) {
                    x = 10;
                } else  {
                    x = -10
                }
                var y = 0;
                var z = 1000;
                cubes[i] = new cube(new point3(x, y, z), size);
            }
        }
    }
};

function repaint() {
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }
    render_score();
    render_map();
    render_cubes();
}

function render_score() {
    container.innerHTML += "<text x=\"10\" y=\"30\" font-size=\"25pt\" fill=\"rgba(192,192,192,1)\"> Score: "+score+" </text>"
};

function generateMap() {
    map = [
        new edge(new point3(5, 5, 1000), new point3(5, 5, 10), "rgb(255, 255, 0, 0.5)"),
        new edge(new point3(-5, 5, 1000), new point3(-5, 5, 10), "rgb(255, 255, 0, 0.5)"),
        new edge(new point3(15, 5, 1000), new point3(15, 5, 10), "rgb(0, 255, 0, 0.5)"),
        new edge(new point3(-15, 5, 1000), new point3(-15, 5, 10), "rgb(0, 255, 0, 0.5)"),
        new edge(new point3(25, 5, 1000), new point3(25, 5, 10), "rgb(255, 0, 0, 1)"),
        new edge(new point3(-25, 5, 1000), new point3(-25, 5, 10), "rgb(255, 0, 0, 1)"),
        new edge(new point3(-1000, 5, 1000), new point3(1000, 5, 1000), "rgb(0, 0, 255, 1)")
    ];
}

function render_map() {
    for(let i = 0; i < map.length; i++) {
        map[i].render();
    }
}

function generate_cubes() {
    var cubes = [5];
    for(let i = 0; i < 5; i++) {
        var size = 10;
        var x;
        var rand = Math.floor(Math.random()*10)%3;
        if(rand == 0) {
            x = 0;
        } else if(rand == 1) {
            x = 10;
        } else {
            x = -10
        }
        var y = 0;
        var z = 1050 - (i+1) * 200;
        cubes[i] = new cube(new point3(x, y, z), size);
    }
    return cubes;
}

function render_cubes() {
    for(let i = 0; i < cubes.length; i++) {
        cubes[i].render(container, dx, dy);
    }
}

line = function(x1, y1, x2, y2, color, width) {
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2
        +'" style="stroke:'+color+';stroke-width:'+width+'" />'+"\n";
};

function project(vertex) {
    return new point2(vertex.x/(vertex.z/1000), vertex.y/(vertex.z/1000));
};