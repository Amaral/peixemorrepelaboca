(function(){

	var Particle = function(x, y, speed, direction, grav, sprite) {
		this.initialize(x, y, speed, direction, grav, sprite);
	};
	
	var p = Particle.prototype;

	p.initialize = function(x, y, speed, direction, grav, sprite) {
		this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocity.setLength(speed);
        this.velocity.setAngle(direction);
        this.gravity = new Vector(0, grav || 0);
        this.sprite = sprite;
	}

	p.accelerate = function(accel) {
		this.velocity.addTo(accel);
	}

	p.update = function() {
		this.velocity.addTo(this.gravity);
		this.position.addTo(this.velocity);
		this.sprite.x = this.position.getX();
		this.sprite.y = this.position.getY();
		this.sprite.rotation = this.velocity.getAngle() / Math.PI * 180;

	}

	window.Particle = Particle;

}());
