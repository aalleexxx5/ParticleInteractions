var c,ctx;
var
	particles = [],
	elevated = 255,
	tailLength =200,
	RADIUS = 20,
	particlesNum = 200;
start();

function resize() {//Is called when the window is resized
	c.width = window.innerWidth;
	c.height = window.innerHeight;
}
function start() { //Called when the page loads.
	c = document.getElementById("canvas"); //saves the canvas in "c"
	ctx = c.getContext("2d"); //creates the element used for drawing
	resize();
	window.addEventListener("resize", resize, false); //makes sure the resize is called when the window is resized

	for (var i=0;i<particlesNum;i++){ //creates "particleNum" random particles
		particles.push(new Factory());
	}

	window.requestAnimationFrame(draw); //starts the animation
}

function draw(){
	ctx.fillStyle="#ffffff";
	ctx.clearRect(0,0, c.width, c.height);
	ctx.globalCompositeOperation = 'lighter';// white effect when stuff passes over each other

	for (var i=0;i<particlesNum;i++){ //loop through all particles
		var particle=particles[i];

		ctx.fillStyle="rgb("+particle.red+", "+particle.green+", "+particle.blue+")"; // Set drawing color to be the color of the particle
		ctx.beginPath();//start a drawing
		ctx.arc(particle.x,particle.y,RADIUS,0,2*Math.PI);//go in a circle
		ctx.fill(); //fill the circle
		ctx.closePath(); //stop the drawing

		if (particle.state!=0){
			particle.red=particle.state;
			particle.blue=Math.floor((255-particle.state)/2);
			particle.state--;
		}
		particle.x+=particle.vx; //update the particles' location
		particle.y+=particle.vy;

		for(var j=0;j<particlesNum;j++) {
			if (particles[j].x + RADIUS * 2>=particle.x) {
				if (particles[j].x - RADIUS * 2<=particle.x) {
					if (particles[j].y + RADIUS * 2>=particle.y){
						if (particles[j].y - RADIUS * 2<=particle.y) {
							if (j!=i) {
								if (sqr(particles[j].x - particle.x) + sqr(particles[j].y - particle.y)<sqr(RADIUS*2)) {
									particle.state=elevated;
									var speed = Math.sqrt(sqr(particle.vx)+sqr(particle.vy));

									particle.vx= particle.x-particles[j].x;
									particle.vy= particle.y-particles[j].y;

									var divisor= speed / Math.sqrt(sqr(particle.vx)+sqr(particle.vy));
									particle.vx = particle.vx * divisor;
									particle.vy= particle.vy * divisor;
								}
							}
						}
					}
				}
			}
		}

		//make the particle "bounce" on the edges
		if (particle.x>c.width) {
			particle.vx= -(particle.vx * (Math.random() + 0.5));
			particle.x=c.width; //make sure the particle can't escape the area (if the window is resized, or the particle velocity is very high)
			if (Math.abs(particle.vx)<0.1) {
				particle.vx*=1.1; //make sure the particle doesn't slow down too much
			}
		} else if (particle.x<0) {
			particle.vx= -(particle.vx * (Math.random() + 0.5));
			particle.x=0;
			if (Math.abs(particle.vx)<0.1) {
				particle.vx*=1.1;
			}
		}

		if (particle.y>c.height) {
			particle.vy= -(particle.vy * (Math.random() + 0.5));
			particle.y=c.height;
			if (Math.abs(particle.vy)<0.1) {
				particle.vy*=1.1;
			}
		} else if (particle.y<0) {
			particle.vy= -(particle.vy * (Math.random() + 0.5));
			particle.y=0;
			if (Math.abs(particle.vy)<0.1) {
				particle.vy*=1.1;
			}
		}
	}
	window.requestAnimationFrame(draw); //start over next frame
}

function Factory(){ //creates a random particle
	this.state = 0;
	var nocol = false;
	while (!nocol) {
		this.x=Math.round(Math.random() * c.width); //random x position between 0 and the screen width.
		this.y=Math.round(Math.random() * c.height);
		nocol=true;
		for (var j=0; j<particles.length; j++) {
			if (particles[j].x + RADIUS * 2<this.x) continue;
			if (particles[j].x - RADIUS * 2>this.x) continue;
			if (particles[j].y + RADIUS * 2<this.y) continue;
			if (particles[j].y - RADIUS * 2>this.y) continue;
			nocol=false;
		}
	}
	this.red=0;
	this.green=0;
	this.blue=128;
	this.vx = ( Math.random() * 1) - 0.5; //random velocity between -0.5 and 0.5 pixels pr frame
	this.vy = ( Math.random() * 1) - 0.5;
}

function sqr(a){
	return a*a;
}
