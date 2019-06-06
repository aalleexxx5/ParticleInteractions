var c,ctx;
var
	particles = [],
	elevated = 255,
	RADIUS = 20,
	particlesNum = 200,
	particleSpeedLimit = 2;
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
	ctx.globalCompositeOperation = 'source-over';// white effect when stuff passes over each other

	for (var i=0;i<particlesNum;i++){ //loop through all particles
		var particle=particles[i];

		//Draw the individual particle
		ctx.fillStyle="rgb("+particle.red+", "+particle.green+", "+particle.blue+")"; // Set drawing color to be the color of the particle
		ctx.beginPath();//start a drawing
		ctx.arc(particle.x,particle.y,RADIUS,0,2*Math.PI);//go in a circle
		ctx.fill(); //fill the circle
		ctx.closePath(); //stop the drawing

		//Coloring
		if (particle.state!=0){
			particle.red=particle.state;
			particle.blue=Math.floor((255-particle.state)/2);
			particle.state--;
		}
		particle.x+=particle.vx; //update the particles' location
		particle.y+=particle.vy;

		for(var j=i+1;j<particlesNum;j++) {//Particle collision logic:
			if (sqr(particles[j].x - particle.x) + sqr(particles[j].y - particle.y)<sqr(RADIUS*2)) {
				forcefulCollision(particle, particles[j]);
			}
		}

		//make the particle "bounce" on the edges
		if (particle.x>c.width) {
			particle.vx= -(particle.vx * (Math.random() + 0.5));
			particle.x=c.width; //make sure the particle can't escape the area (if the window is resized, or the particle velocity is very high)
			if (Math.abs(particle.vx)<0.1) {
				particle.vx*=1.1; //make sure the particle doesn't slow down too much
			}else if(Math.abs(particle.vx)>particleSpeedLimit){
				particle.vx*=0.8;
			}
		} else if (particle.x<0) {
			particle.vx= -(particle.vx * (Math.random() + 0.5));
			particle.x=0;
			if (Math.abs(particle.vx)<0.1) {
				particle.vx*=1.1;
			}else if(Math.abs(particle.vx)>particleSpeedLimit){
				particle.vx*=0.8;
			}
		}

		if (particle.y>c.height) {
			particle.vy= -(particle.vy * (Math.random() + 0.5));
			particle.y=c.height;
			if (Math.abs(particle.vy)<0.1) {
				particle.vy*=1.1;
			}else if(Math.abs(particle.vy)>particleSpeedLimit){
				particle.vy*=0.8;
			}
		} else if (particle.y<0) {
			particle.vy= -(particle.vy * (Math.random() + 0.5));
			particle.y=0;
			if (Math.abs(particle.vy)<0.1) {
				particle.vy*=1.1;
			}else if(Math.abs(particle.vy)>particleSpeedLimit){
				particle.vy*=0.8;
			}
		}
	}
	window.requestAnimationFrame(draw); //start over next frame
}

function simpleCollision(particle1, particle2){
	particle1.state=elevated;
	var speed = Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy));

	particle1.vx= particle1.x-particle2.x;
	particle1.vy= particle1.y-particle2.y;

	var divisor= speed / Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy));
	particle1.vx = particle1.vx * divisor;
	particle1.vy= particle1.vy * divisor;
}

function stickyCollision(particle1, particle2){
	particle1.state=elevated;
	particle2.state=elevated;

	var speed = (Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy))+Math.sqrt(sqr(particle2.vx)+sqr(particle2.vy)))/2;

	var centerVectorX = particle1.x-particle2.x;
	var centerVectorY = particle1.y-particle2.y;

	var angle = Math.acos((centerVectorX*particle1.vx+centerVectorY*particle1.vy)/(Math.sqrt(sqr(centerVectorX)+sqr(centerVectorY))*Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy))));

	particle2.vx = centerVectorX*Math.cos(angle)-centerVectorY*Math.sin(angle);
	particle2.vy = centerVectorX*Math.sin(angle)+centerVectorY*Math.cos(angle);

	var divisor= speed / Math.sqrt(sqr(particle2.vx)+sqr(particle2.vy));
	particle2.vx = particle2.vx * divisor;
	particle2.vy= particle2.vy * divisor;

}
function advancedCollision(particle1, particle2){
	particle1.state=elevated;
	particle2.state=elevated;

	var speed = (Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy))+Math.sqrt(sqr(particle2.vx)+sqr(particle2.vy)))/2;

	var centerVectorX = particle1.x-particle2.x;
	var centerVectorY = particle1.y-particle2.y;

	var angle = Math.acos((centerVectorX*particle1.vx+centerVectorY*particle1.vy)/(Math.sqrt(sqr(centerVectorX)+sqr(centerVectorY))*Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy))));

	centerVectorX=0-centerVectorX;
	centerVectorY=0-centerVectorY;

	particle1.vx = centerVectorX*Math.cos(angle)-centerVectorY*Math.sin(angle);
	particle1.vy = centerVectorX*Math.sin(angle)+centerVectorY*Math.cos(angle);

	var divisor= speed / Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy));
	particle1.vx = particle1.vx * divisor;
	particle1.vy= particle1.vy * divisor;

	particle2.vx=0-particle1.vx;
	particle2.vy=0-particle1.vy;
}

function verySimpleCollision(particle1, particle2){
	particle1.state=elevated;
	particle2.state=elevated;
	var temp = particle1.vx;
	particle1.vx=particle2.vx;
	particle2.vx=temp;
	temp=particle1.vy;
	particle1.vy=particle2.vy;
	particle2.vy=temp;

	particle1.x+=particle1.vx;
	particle1.y+=particle1.vy;
	particle2.x+=particle2.vx;
	particle2.y+=particle2.vy;
}

function simpleCollisionWithSpeedSwap(particle1, particle2){
	particle1.state=elevated;
	particle2.state=elevated;
	var speed1 = Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy));
	var speed2 = Math.sqrt(sqr(particle2.vx)+sqr(particle2.vy));

	particle1.vx= particle1.x-particle2.x;
	particle1.vy= particle1.y-particle2.y;
	particle2.vx= particle2.x-particle1.x;
	particle2.vy= particle2.y-particle1.y;


	var divisor= speed2 / Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy));
	particle1.vx = particle1.vx * divisor;
	particle1.vy= particle1.vy * divisor;
	divisor= speed1 / Math.sqrt(sqr(particle2.vx)+sqr(particle2.vy));
	particle2.vx = particle2.vx * divisor;
	particle2.vy= particle2.vy * divisor;
}

function forcefulCollision(particle1, particle2){
	particle1.state=particle2.state=elevated;
	//particle2.state=elevated;

	//var force = Math.abs(Math.sqrt(sqr(particle2.vx)+sqr(particle2.vy))-Math.sqrt(sqr(particle1.vx)+sqr(particle1.vy)));
	var force = 1;
	var centerX1 = particle2.x-particle1.x;
	var centerY1 = particle2.y-particle1.y;

	var divisor = force /Math.sqrt(sqr(centerX1)+sqr(centerY1));
	centerX1=centerX1*divisor;
	centerY1=centerY1*divisor;

	particle1.vx-=centerX1;
	particle1.vy-=centerY1;

	particle2.vx+=centerX1;
	particle2.vy+=centerY1;

	particle1.x+=particle1.vx;
	particle1.y+=particle1.vy;
	particle2.x+=particle2.vx;
	particle2.y+=particle2.vy;
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
