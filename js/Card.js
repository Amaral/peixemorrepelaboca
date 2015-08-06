(function(){

	var Card = function() {
		this.initialize();
	};
	
	var p = Card.prototype = new createjs.Container();
	p.container_initialize = p.initialize;

	p.initialize = function() {

		this.container_initialize();
		this.bg = new createjs.Shape();
		this.close = new createjs.Bitmap('assets/close.jpg');
		this.close.alpha = 0;
		this.addChild(this.close);
		this.currentBgColor = null

		this.m = 0;
		this.w = 0;
		this.h = 0;

	};

	p.drawBg = function(width, height, color) {

		this.currentBgColor = color || this.currentBgColor;

		this.bg.graphics.clear();
		
		this.bg.graphics.beginFill(this.currentBgColor);
		this.m = height * 0.14;
		this.h = height - this.m;

		var maxWidth = 648;

		if(width < 850) {
			this.m = height * 0.30;
			maxWidth = maxWidth - maxWidth *0.15
			this.h = height - this.m;
		}
		
	
		var maxHeight = 980;
		var p = (height / maxHeight);
		if(p > 1) p = 1;
		this.w = maxWidth * p;
	

		this.bg.y = this.close.y = Math.round(this.m / 2);
		this.close.y--;
		this.close.x = -24;

		this.bg.graphics.drawRect(0, 0, this.w, this.h);
		
		this.x = ( width - this.w )/2;

	};

	p.show = function(width, height , color, delay) {

		this.drawBg(width, height, color);

		this.bg.scaleY = 0;
		this.close.alpha = 0;

		this.addChild(this.bg);

		createjs.Tween.get(this.bg).wait(delay).to({scaleY:1}, 500,createjs.Ease.quadInOut);
		createjs.Tween.get(this.close).wait(delay).to({alpha:1}, 500,createjs.Ease.quadInOut);

	};

	

	p.hide = function() {

		createjs.Tween.get(this.close).to({alpha:0}, 200,createjs.Ease.quadInOut);
		createjs.Tween.get(this.bg).to({scaleY:0}, 200,createjs.Ease.quadInOut);

	};

	window.Card = Card;

}());
