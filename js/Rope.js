(function(){

	var Rope = function(startX, startY, hook) {
		this.initialize(startX, startY, hook);
	};
	
	var p = Rope.prototype = new createjs.Container();
	p.container_initialize = p.initialize;

	p.initialize = function(startX, startY, hook) {
		this.container_initialize();

		this.startX = startX;
		this.startY = startY;
		this.hook = hook;
		this.lastPointX = 0;
		this.lastPointY = 0;

		this.hook.regX = 17;
		this.hook.regY = 7;

		// rope properties
		this.len = 3;
		this.div = 90;
		this.lenDiv = this.len / this.div;

		// World Characteristics
		this.g  = 9.81;
		this.pm = 300; // Pixels/meter
		this.maxPm = 300;
		this.dt = 1 / 60;

		// Program Characteristics
		this.pX = [];
		this.pY = [];
		this.oX = [];
		this.oY = [];
		this.aX = [];
		this.aY = [];
		this.ropeShape = new createjs.Shape();

		for (var i = 0; i <= this.div; i++) {
			this.pX[i] = 10 + (this.lenDiv * this.pm * i);
			this.pY[i] = 10;
			this.oX[i] = 10 + (this.lenDiv * this.pm * i);
			this.oY[i] = 10;
			this.aX[i] = 0;
			this.aY[i] = 0;
		}

		this.addChild(this.ropeShape);
		this.addChild(this.hook);
	}

	p.update = function(x, y) {
		// pontos iniciais
		this.pX[0] = this.startX;
		this.pY[0] = this.startY;

		this.pX[this.pX.length-1] = x
		this.pY[this.pY.length-1] = y;


		this.accForces();
		this.verlet();
		
		for (var i = 0; i <= this.div;i++){
			this.satConstraints();
		}
		// Draw line
		this.ropeShape.graphics.clear();
		this.ropeShape.graphics.beginStroke('#000');
		this.ropeShape.graphics.setStrokeStyle(2);
		this.ropeShape.graphics.moveTo(this.pX[0], this.pY[0]);
		for (var i = 0; i <= this.div; i++) {
			this.ropeShape.graphics.lineTo(this.pX[i], this.pY[i]);
		}
		this.hook.x = this.pX[this.pX.length-1];
		this.hook.y = this.pY[this.pY.length-1];
		this.lastPointX = this.hook.x;
		this.lastPointY = this.hook.y;

	};

	p.verlet = function() {
		var a = 0.9
		for (var i = 0; i <= this.div; i++) {
			var tempX = this.pX[i];
			this.pX[i] += (a * this.pX[i] - a * this.oX[i]) + (this.aX[i] * this.pm * this.dt * this.dt);
			var tempY = this.pY[i];
			this.pY[i] += (a * this.pY[i] - a * this.oY[i]) + (this.aY[i] * this.pm * this.dt * this.dt);
			this.oX[i] = tempX;
			this.oY[i] = tempY;
		};
	};

	p.accForces = function() {
		for (var i = 1; i <= this.div; i++) {
			this.aY[i] = this.g;
		};
	};

	p.satConstraints = function() {
		var a = 0.5;
		for (var i = 1; i <= this.div; i++) {
			var dx = (this.pX[i] - this.pX[i-1]) / this.pm;
			var dy = (this.pY[i] - this.pY[i-1]) / this.pm;
			var d = Math.sqrt((dx * dx) + (dy * dy));
			var diff = d - this.lenDiv;
			this.pX[i] -= (dx / d) * a * this.pm * diff;
			this.pY[i] -= (dy / d) * a * this.pm * diff;
			this.pX[i-1] += (dx / d) * a * this.pm * diff;
			this.pY[i-1] += (dy / d) * a * this.pm * diff;
		}
	}

	window.Rope = Rope;

}());