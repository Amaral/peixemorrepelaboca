

(function(){

	var Vector = function(x, y) {
		this.initialize(x, y);
	};
	
	var p = Vector.prototype;

	p.initialize = function(x, y) {
		this._x = x || 0;
		this._y = y || 0;
	};

	p.setX = function(value) {
		this._x = value;
	};

	p.getX = function() {
		return this._x
	};

	p.setY = function(value) {
		this._y = value;
	};

	p.getY = function() {
		return this._y
	};

	p.setAngle = function(angle) {
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	};

	p.getAngle = function() {
		return Math.atan2(this._y, this._x);
	};

	p.setLength = function(length) {
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	};

	p.getLength = function() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	};

	p.add = function(v2) {
		return new Vector(this._x + v2.getX(), this._y + v2.getY());
	};

	p.addTo = function(v2) {
		this._x += v2.getX();
		this._y += v2.getY();
	};

	window.Vector = Vector;

}());
