this.window = this. window || {};

(function(){

	var Splash = function() {
		this.initialize();
	};
	
	var p = Splash.prototype = new createjs.Container();
	p.container_initialize = p.initialize;

	p.initialize = function() {

		this.container_initialize();
		this.particles = [];
		this.isExploding = false;
		
		
	}
	p.explode = function(x, y) {

		if(this.isExploding) return false;
		this.isExploding = true;
		this.x = x;
		this.y = y;

		this.removeAllChildren();
			this.particles = [];
		this.numberParticles = 15;
		var shape = null;
		var p = null;
		for (var i = 0; i < this.numberParticles; i++) {
			shape = new createjs.Shape();
			shape.graphics.beginFill("#000");
			shape.graphics.drawRect(0,0,4,4);
			shape.regX = shape.regY = 2;
			p = new Particle(0, 0, Math.random() * 5 + 2, - Math.random() * Math.PI, 0.2, shape);
			this.particles.push(p);
			this.addChild(shape);
		};

	}
	p.update = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
		};
	}

	window.Splash = Splash;

}());
