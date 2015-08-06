
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

window.onload = function () {

	var canvas = document.getElementById("canvas"),
		btnSave = document.getElementById("save"),
		btnShare = document.getElementById("share"),
		btnManifest = document.getElementById("manifest"),
		btnContact = document.getElementById("contact"),
		menuCard = document.getElementById("menuCard"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.innerHeight,
		stage = new createjs.Stage(canvas),
		hook = new createjs.Bitmap('assets/hook.png'),
		manifest = new createjs.Bitmap('assets/manifesto.png'),
		rope = new Rope(width/2, -300, hook),
		particles = [],
		numberParticles = 5,
		canFish = true,
		animatingCaught = false,
		card = new Card(),
		containerFish = new createjs.Container(),
		minSpeed = 1,
		maxSpeed = 6,
		currentRandomSpeed = 1,
		maxWidth = 1920,
		maxHeight = 980,
		currentFish = null,
		currentDataFish = null,
		releaseFish = false;

	function init() {

		facebook();

		createjs.CSSPlugin.install();

		btnSave.style.opacity = 0;
		btnManifest.style.opacity = 0;
		btnShare.style.opacity = 0;
		manifest.alpha = 0;
		btnContact.style.opacity = 0;
		btnSave.style.visibility = 'hidden';
		btnManifest.style.visibility = 'hidden';
		btnShare.style.visibility = 'hidden';
		btnContact.style.visibility = 'hidden';

		rope.lastPointX = width / 2;
		rope.lastPointY = height / 2;
		stage.addChild(containerFish);
		stage.addChild(rope);
		stage.addChild(card);
		createjs.Touch.enable(stage);
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick',update);

		setupEvents();
	};

	function facebook () {
		 
		window.fbAsyncInit = function() {
			FB.init({
				appId      : '243270475845873',
				status     : true,
				xfbml      : true
			});
		};

		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

	}

	function setupEvents() {

		window.addEventListener('resize',resize);
		btnSave.addEventListener('click',mClickSave);
		btnShare.addEventListener('click',mClickShare);
		btnManifest.addEventListener('click',mClickManifest);

		resize();

	};

	function mClickSave() {
		var url = 'assets/download/' + currentDataFish.download;
        window.open(url);
	};

	function mClickShare() {

		//var url = 'http://www.peixemorrepelaboca.com.br';
		//var url = 'http://localhost/peixemorrepelaboca/';
		var url = 'http://felipeamaral.net/fishing/';
		FB.ui(
			{
				method: 'feed',
				name: 'Peixe Morre Pela Boca',
				description: (
					'Peixe Morre Pela Boca é um projeto pela valorização da atenção às mensagens que emitimos todos os dias. Um cuidado com nós mesmos e uma reflexão sobre nosso comportamento excessivo.'
				),
				link: url,
				picture: url + 'assets/download/' + currentDataFish.download
			},
			function(response) {
				if (response && response.post_id) {
					console.log('Post was published.');
				} else {
					console.log('Post was not published.');
				}
			}
		);
	};

	function mClickManifest() {
		showManifest();
	};

	function resize() {

		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		rope.pm = rope.maxPm * (height / maxHeight);
		rope.startX = width / 2;
		card.drawBg(width, height);
		currentRandomSpeed = Math.round( (width / maxWidth) * maxSpeed ) ;

		if(currentFish && !canFish && !animatingCaught) {
			currentFish.position.setX(width / 2);
			
			var scaleFish = (card.h * 0.8) / 100;
			currentFish.position.setY(card.bg.y + (card.h - scaleFish * 100)/2);
			currentFish.sprite.scaleX = currentFish.sprite.scaleY = scaleFish;
		}

		if( width > 1600 ) {

			btnSave.style.top = (height - btnSave.offsetHeight) / 2 + 'px';
			btnShare.style.top = (height - btnShare.offsetHeight) / 2 + 'px';
			btnManifest.style.top = (height - btnManifest.offsetHeight) / 2 + 'px';
			btnContact.style.top = (height - btnManifest.offsetHeight) / 2 +  height * 0.2 + 'px';

			var w = (width - card.w)/2;
			var m = 40; 	 
			var wBtns = (btnSave.offsetWidth + btnShare.offsetWidth + m);

			var x = (w - wBtns) / 2;
			btnSave.style.left = x + 'px';
			btnShare.style.left = x + btnSave.offsetWidth + m + 'px';

			x = w + card.w + (w - btnManifest.offsetWidth) / 2;
			btnManifest.style.left = x + 'px';
			btnContact.style.left = x + 'px';
			
		} else if(width > 1000 && width < 1600) {

			btnSave.style.top = (height - btnSave.offsetHeight) / 2 + 'px';
			btnShare.style.top = (height - btnShare.offsetHeight) / 2 + 'px';
			btnManifest.style.top = (height - btnManifest.offsetHeight) / 2 + 'px';
			btnContact.style.top = (height - btnManifest.offsetHeight) / 2 +  height * 0.2 + 'px';

			var w = (width - card.w)/2;
			var m = 40; 	 
			var wBtns = (btnSave.offsetWidth + btnShare.offsetWidth + m);

			var x = (w - wBtns) / 2;
			btnSave.style.left = x + 'px';
			btnShare.style.left = x + btnSave.offsetWidth + m + 'px';

			x = w + card.w + (w - btnManifest.offsetWidth) / 2;
			btnManifest.style.left = x + 'px';
			btnContact.style.left =  x + 'px';

		} else {

			var marginBottom = 20; 
			btnSave.style.top = (card.bg.y - btnSave.offsetHeight - marginBottom) + 'px';
			btnShare.style.top = (card.bg.y - btnShare.offsetHeight - marginBottom)  + 'px';
			btnManifest.style.top = (card.bg.y - btnManifest.offsetHeight - marginBottom)  + 'px';
			btnContact.style.top = height - 30 + 'px';

			var w = width;
			var m = 40;
			var wBtns = (btnSave.offsetWidth + btnShare.offsetWidth + btnManifest.offsetWidth + m*2);

			var x = (w -wBtns) / 2;
			btnSave.style.left = x + 'px';
			btnShare.style.left = x + btnSave.offsetWidth + m + 'px';

			btnManifest.style.left = parseInt(btnShare.style.left) + btnShare.offsetWidth + m + 'px';
			btnContact.style.left = (w - btnContact.offsetWidth  )/ 2+ 'px';
		
		}

		manifestResize();
	};

	function manifestResize() {

		manifest.y = card.bg.y;
		manifest.x = card.x;
		manifest.scaleX = card.w/manifest.image.width;
		manifest.scaleY = card.h/manifest.image.height;
		
	};

	function showManifest () {
		manifestResize();
		manifest.alpha = 0;
		createjs.Tween.get(manifest).to({alpha:1},500);
		stage.addChild(manifest);
	};

	function closeManifest () {
		createjs.Tween.get(manifest).to({alpha:0},500).call(function(){
			stage.removeChild(manifest);
		});
	};

	function showMenuCard(delay) {
		btnSave.style.visibility = 'visible';
		btnManifest.style.visibility = 'visible';
		btnShare.style.visibility = 'visible';
		btnContact.style.visibility = 'visible';
		createjs.Tween.get(btnSave).wait(delay).to({opacity:1},500);
		createjs.Tween.get(btnManifest).wait(delay).to({opacity:1},500);
		createjs.Tween.get(btnShare).wait(delay).to({opacity:1},500);
		createjs.Tween.get(btnContact).wait(delay).to({opacity:1},500);
	};

	function hideMenuCard() {
		createjs.Tween.get(btnSave).to({opacity:0},500);
		createjs.Tween.get(btnManifest).to({opacity:0},500);
		createjs.Tween.get(btnShare).to({opacity:0},500);
		createjs.Tween.get(btnContact).to({opacity:0},500).call(function(){
			btnSave.style.visibility = 'hidden';
			btnManifest.style.visibility = 'hidden';
			btnShare.style.visibility = 'hidden';
			btnContact.style.visibility = 'hidden';
		});
	};

	function createParticle() {

		if(particles.length < numberParticles) {

			var p = getParticle();
			particles.push(p);
			containerFish.addChild(p.sprite);

		}

	};

	function getParticle() {
		var props = getParticlesRandomProperties();
		return new Fish(props.x, props.y, props.speed, props.accel, props.angle, props.gravity);
	};

	function getParticlesRandomProperties() {
		return {
			x : -100 + Math.random() * - 200,
			y : height + 180,
			speed: Math.round(9 + Math.random() * currentRandomSpeed),
			accel: new Vector(0.005 + Math.random() * 0.005, 0),
			angle: -Math.PI / 4,
			gravity: 0.1
		};
	};

	function resetParticle (p) {
		
		var props = getParticlesRandomProperties();
		p.reset(props.x, props.y, props.speed, props.accel, props.angle, props.gravity);
		
		return p;
	};

	function update(e) {
		
		createParticle();

		var mouseX = stage.mouseX;
		var mouseY = stage.mouseY;
		var	p = null;
		var rectMouse = new createjs.Rectangle(0,0,30,30);
		var rectFish = new createjs.Rectangle(0,0,100,63);
		var splash;

		for (var i = 0; i < particles.length; i++) {

			p = particles[i];
			
			if(p.velocity.getAngle() >= 0.8 && p.position.getY() > height + 100) {
				p = resetParticle(p);
				particles[i] = p;
			};

			rectMouse.x = rope.lastPointX - 20;
			rectMouse.y = rope.lastPointY;

			rectFish.x = p.position.getX() - rectFish.width;
			rectFish.y = p.position.getY() - rectFish.height / 2;

			if(canFish && rectOverlap(rectMouse,rectFish) && !p.release) {
				p.caught = true;
				canFish = false;
				currentFish = p;
				animatingCaught = true;
				stage.addChild(p.sprite)
				animationCaught(p);
			}

			if(p.caught) {

				if(animatingCaught) {
					p.position.setX(rope.lastPointX);
					p.position.setY(rope.lastPointY);
				};

				rope.update(rope.lastPointX, rope.lastPointY);

			} else {

				p.accelerate();
				p.update();
				p.sprite.rotation = p.velocity.getAngle() / Math.PI * 180;
			
			}
		
			p.sprite.x = p.position.getX(); 
			p.sprite.y = p.position.getY();
			
		};


		if(canFish) {
			if(mouseX != 0 && mouseY != 0) {
				rope.update(mouseX, mouseY);
			} else {
				// primeira vez que entra no site
				rope.update(width/2 + 200, height/2 - 100);
			}
		}

		stage.update();
		
		//para firefox setTimeout(function() { update(); }, 16);
		//requestAnimationFrame(update)

	};

	function animationCaught(fish) {

		var scaleFish = (card.h * 0.8)/100;
		
		createjs.Tween.get(rope).to({startY:-2000,lastPointY:card.bg.y + (card.h - scaleFish * 100)/2,lastPointX:width/2}, 700,createjs.Ease.quadInOut).wait(600).call(function(){
			animatingCaught = false;
			showMouse();
			card.close.addEventListener('click',closeCard);

		}).to({startY:-9000,lastPointY:-1000}, 500);

		createjs.Tween.get(fish.sprite).to({scaleX:scaleFish,scaleY:scaleFish}, 700,createjs.Ease.quadInOut);
		
		createjs.Tween.get(fish.sprite).to({rotation:-90}, 500,createjs.Ease.quadInOut);

		var aux = DataCards.cards[Math.floor(Math.random() * DataCards.cards.length)];
		while(currentDataFish === aux) {
			aux = DataCards.cards[Math.floor(Math.random() * DataCards.cards.length)];
		}
		currentDataFish = aux;
		var colors = DataCards.colors[currentDataFish.color];

		var colorFish = colors.fish;
		var colorCard = colors.bg;
		fish.showFishColor(700,createjs.Graphics.getRGB(colorFish.r, colorFish.g, colorFish.b),currentDataFish.image,scaleFish);

		card.show(width, height,createjs.Graphics.getRGB(colorCard.r, colorCard.g, colorCard.b), 700);
		showMenuCard(700, createjs.Graphics.getRGB(colorCard.r, colorCard.g, colorCard.b));
		
	};

	function closeCard () {
		if(manifest.alpha > 0) {
			closeManifest();
		}else {
			fishRelease();
		}
	}

	function fishRelease() {

		card.close.removeEventListener('click',closeCard);

		var prop = {angle:Math.PI/2};
		angle = -Math.PI/2;
		
		currentFish.velocity.setAngle(-Math.PI/2);
		currentFish.velocity.setLength(10);
		currentFish.gravity.setY(0.23);
		currentFish.accel = new Vector(-0.1 + Math.random() * 0.2, 0);
		currentFish.release = true;
		currentFish.caught = false;

		hideMouse();

		hideMenuCard();
		card.hide();
		currentFish.hideFishColor();
		createjs.Tween.get(currentFish.sprite).to({scaleX:1,scaleY:1}, 200,createjs.Ease.quadInOut).call(function() {

			containerFish.addChild(currentFish.sprite);
			currentFish = null;
			resize();
			stage.removeChild(rope);
			canFish = true;
			rope = new Rope(width / 2, -300, hook);
			stage.addChild(rope);
			
		});
	}

	function showMouse() {
		canvas.style.cursor = 'auto';
	}

	function hideMouse() {
		canvas.style.cursor = 'none';
	}


	function valueInRange(value, min, max) { return (value >= min) && (value <= max); }

	function rectOverlap(rectA, rectB) {

	    var xOverlap = valueInRange(rectA.x, rectB.x, rectB.x + rectB.width) ||
	                    valueInRange(rectB.x, rectA.x, rectA.x + rectA.width);

	    var yOverlap = valueInRange(rectA.y, rectB.y, rectB.y + rectB.height) ||
	                    valueInRange(rectB.y, rectA.y, rectA.y + rectA.height);

	    return xOverlap && yOverlap;
	};

	init();
};