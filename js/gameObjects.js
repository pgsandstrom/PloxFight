(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	ploxfight.getFist = function (dude) {
		var xForce = Math.sin(dude.degree);
		var yForce = Math.cos(dude.degree);

		var fist = {
			type: "fist",
			id: dude.id,
			degree: dude.degree,
			x: dude.x,
			y: dude.y,
			shape: ploxfight.shape.SQUARE,
			shapeWidth: 10,
			shapeHeight: dude.shapeHeight,
			pushability: 0
		};

		// move to front of character:
		ploxfight.performMove(fist, xForce, yForce, dude.shapeHeight);

		// shift slightly to the right::
		var rightDegree = dude.degree - Math.PI / 2;
		var xForceRight = Math.sin(rightDegree);
		var yForceRight = Math.cos(rightDegree);
		ploxfight.performMove(fist, xForceRight, yForceRight, 10);

		return fist;
	};

	ploxfight.getBullet = function (dude) {
		var xForce = Math.sin(dude.degree);
		var yForce = Math.cos(dude.degree);

		var bullet = new Bullet(dude);

		// move to front of character:
		ploxfight.performMove(bullet, xForce, yForce, dude.shapeHeight);

		// shift slightly to the right::
		var rightDegree = dude.degree - Math.PI / 2;
		var xForceRight = Math.sin(rightDegree);
		var yForceRight = Math.cos(rightDegree);
		ploxfight.performMove(bullet, xForceRight, yForceRight, 10);

		return bullet;
	};

	var Bullet = function Bullet(dude) {
		this.type = "bullet";
		this.id = dude.id;
		this.degree = dude.degree;
		this.x = dude.x;
		this.y = dude.y;
		//this.endX;
		//this.endY;
		this.shape = ploxfight.shape.LINE;
		this.shapeLength = 10;	//TODO: Skippa length, bara låta den "vara" speed?
		this.speed = 50;
		this.age = 0;
		this.active = true;

		this.update();
	};

	Bullet.prototype.update = function () {
		var xForce = Math.sin(this.degree);
		var yForce = Math.cos(this.degree);

		ploxfight.performMove(this, xForce, yForce, this.speed);

		var endPosition = ploxfight.getNewPosition(this.x, this.y, xForce, yForce, this.speed);

		this.endX = endPosition.x;
		this.endY = endPosition.y;
	}

})();
