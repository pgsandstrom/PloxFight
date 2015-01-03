(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};
	ploxfight.shape = ploxfight.shape || {};

	ploxfight.shape.SQUARE = "SQUARE";
	ploxfight.shape.CIRCLE = "CIRCLE";

	ploxfight.getDistance = function (x1, y1, x2, y2) {
		var xDiff = Math.abs(x1 - x2);
		var yDiff = Math.abs(y1 - y2);
		return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	};

	ploxfight.collision = function (object1, object2) {
		//Assume squares currently...
		var vectors1 = object1.getVectors();
	};

	ploxfight.getSquareCorners = function (object) {
		//this.degree;
		//this.x = x;
		//this.y = y;
		//this.shapeWidth = 50;
		//this.shapeHeight = 50;

		var degree = -object.degree;	// WARNING: I use minus here and I'm not sure why it is needed...

		//TODO this isnt "top left" if rotated. Is that important?
		var TLx_pre = -object.shapeWidth / 2;
		var TLy_pre = -object.shapeHeight / 2;
		var TLx = object.x + rotateX(TLx_pre, TLy_pre, degree);
		var TLy = object.y + rotateY(TLx_pre, TLy_pre, degree);

		var TRx_pre = object.shapeWidth / 2;
		var TRy_pre = -object.shapeHeight / 2;
		var TRx = object.x + rotateX(TRx_pre, TRy_pre, degree);
		var TRy = object.y + rotateY(TRx_pre, TRy_pre, degree); //TODO: this is same as TLy... same for other points. Can be optimized.

		var BLx_pre = -object.shapeWidth / 2;
		var BLy_pre = +object.shapeHeight / 2;
		var BLx = object.x + rotateX(BLx_pre, BLy_pre, degree);
		var BLy = object.y + rotateY(BLx_pre, BLy_pre, degree);

		var BRx_pre = object.shapeWidth / 2;
		var BRy_pre = object.shapeHeight / 2;
		var BRx = object.x + rotateX(BRx_pre, BRy_pre, degree);
		var BRy = object.y + rotateY(BRx_pre, BRy_pre, degree);

		return [
			{
				x: TLx,
				y: TLy
			},
			{
				x: TRx,
				y: TRy
			},
			{
				x: BRx,
				y: BRy
			},
			{
				x: BLx,
				y: BLy
			}
		];

	};

	//var rotateVector = function (x, y, degree) {
	//	x = x * Math.cos(degree) - y * Math.sin(degree);
	//	y = x * Math.sin(degree) + y * Math.cos(degree);
	//	return {
	//		x: x,
	//		y: y
	//	}
	//};

	ploxfight.Vector = function Vector(x, y, degree) {
		if (degree === undefined) {
			this.x = x;
			this.y = y;
			this.degree = 0;
		} else {
			this.x = rotateX(x, y, degree);
			this.y = rotateX(x, y, degree);
			this.degree = degree;
		}
	};

	var Vector = ploxfight.Vector;

	//TODO: Would it optimize to make those method "static"?

	Vector.prototype.perp = function () {
		return new Vector(-this.x, this.y);
	};

	Vector.prototype.subtract = function (vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	};

	//Vector.prototype.rotate = function (degree) {
	//var x = this.x * Math.cos(degree) - this.y * Math.sin(degree);
	//var y = this.x * Math.sin(degree) + this.y * Math.cos(degree);
	//return new Vector(x, y);
	//}

	var rotateX = function (x, y, degree) {
		return x * Math.cos(degree) - y * Math.sin(degree);
	};

	var rotateY = function (x, y, degree) {
		return x * Math.sin(degree) + y * Math.cos(degree);
	};

})();