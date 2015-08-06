(function(){

	var Fish = function(x, y, speed, accel, direction, grav) {
		this.initialize(x, y, speed, accel, direction, grav);
	};
	
	var p = Fish.prototype;

	p.initialize = function(x, y, speed, accel, direction, grav) {

		this.sprite = new createjs.Container();
		this.spriteBlack = this.drawFish('#000');
		this.spriteColor = null;
		this.splash = null;
		this.sprite.addChild(this.spriteBlack);
		this.containerText = new createjs.Container();
		this.containerText.rotation = 90;
		this.sprite.addChild(this.containerText);
		this.reset(x, y, speed, accel, direction, grav);
	};

	p.showFishColor = function(delay, color, bitmapName, scale) {
		var self = this;

		this.spriteColor = this.drawFish(color);
		this.spriteColor.alpha = 0;
		this.sprite.addChildAt(this.spriteColor,1);
		createjs.Tween.get(this.spriteColor).wait(delay).to({alpha:1}, 700,createjs.Ease.quadInOut);

		var image = new Image();

		image.onload = function() {

			var bitmap = new createjs.Bitmap(this);
			bitmap.scaleX = bitmap.scaleY = 0.15;
			bitmap.regX = bitmap.image.width / 2;
			bitmap.regY =  bitmap.image.height / 2;
			bitmap.y = 32;
			self.containerText.removeAllChildren();
			self.containerText.addChild(bitmap);
			self.containerText.alpha = 0;
			createjs.Tween.get(self.containerText).wait(delay).to({alpha:1}, 700,createjs.Ease.quadInOut);

		}
		image.src = 'assets/phases/' + bitmapName;
		
	}

	p.hideFishColor = function() {
		var self = this;

		createjs.Tween.get(self.containerText).to({alpha:0}, 200,createjs.Ease.quadInOut).call(function(){
			self.containerText.removeAllChild();
		});	

		createjs.Tween.get(this.spriteColor).to({alpha:0}, 700,createjs.Ease.quadInOut).call(function(){
			self.sprite.removeChild(self.spriteColor);
		});	
	}

	p.drawFish = function(color) {
		var shape = new createjs.Shape();

		shape.graphics.beginFill(color);
		shape.graphics.moveTo(0, 11);
		shape.graphics.lineTo(35, 31);
		shape.graphics.lineTo(68, 0);
		shape.graphics.lineTo(100, 31);
		shape.graphics.lineTo(68, 63);
		shape.graphics.lineTo(35, 31);
		shape.graphics.lineTo(0, 53);
		shape.graphics.lineTo(0, 11);

		shape.regX = 100;
		shape.regY = 31;
		return shape;

	};

	p.reset = function(x, y, speed, accel, direction, grav) {
		this.position = new Vector(x, y);
		this.velocity = new Vector(0, 0)
		this.accel = accel;
		this.gravity = new Vector(0, grav || 0);;
		this.release = false;
		this.caught = false;
		this.velocity.setLength(speed);
		this.velocity.setAngle(direction);
	};

	p.accelerate = function() {
		this.velocity.addTo(this.accel);
	},

	p.update = function() {
		this.velocity.addTo(this.gravity);
		this.position.addTo(this.velocity);
	}


	window.Fish = Fish;

}());
