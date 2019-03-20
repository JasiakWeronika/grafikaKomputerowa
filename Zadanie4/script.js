var canvas = document.createElement("canvas");

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

var fov = 250; 

var ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

var pixels = [];
for(var x = -250; x < 250; x+=2) { 
	for(var z = -250; z < 250; z+=2) {
		pixels.push({x: x, y: 40, z: z});
	}
}
		
function render()
{
	ctx.clearRect(0,0,w,h);
	
	var imagedata = ctx.getImageData(0,0,w,h);

	var i = pixels.length;
	while(i--) {
		var pixel = pixels[i];
		
		var scale = fov/(fov+pixel.z);
		var x2d = pixel.x * scale + w/2;
		var y2d = pixel.y * scale + h/2;
		
		if(x2d >= 0 && x2d <= w && y2d >= 0 && y2d <= h) {
			var c = (Math.round(y2d) * imagedata.width + Math.round(x2d))*4;
			imagedata.data[c] = 255; 
			imagedata.data[c+1] = 020; 
			imagedata.data[c+2] = 147; 
			imagedata.data[c+3] = 255; 
		}
		pixel.z -= 1;
		if(pixel.z < -fov) {
			pixel.z += 2*fov;
		}
	}
	
	ctx.putImageData(imagedata, 0, 0);
}

setInterval(render, 1000/3);



