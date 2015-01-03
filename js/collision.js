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

	ploxfight.checkCollisions = function (player, opponent) {
		//Assume squares currently...
		var playerVectors = ploxfight.getSquareVectors(player);
		//var playerCorners = ploxfight.getSquareCorners(player);
		var opponentVectors = ploxfight.getSquareVectors(opponent);
		//var opponentCorners = ploxfight.getSquareCorners(opponent);

		for (var i = 0; i < playerVectors.length; i++) {
			fixVector(player.x, player.y, playerVectors[i]);
		}
		for (var j = 0; j < opponentVectors.length; j++) {
			fixVector(opponent.x, opponent.y, opponentVectors[j]);
		}


		var playerPolygon = new ploxfight.Polygon(new ploxfight.Vector(player.x, player.y), playerVectors);
		var opponentPolygon = new ploxfight.Polygon(new ploxfight.Vector(opponent.x, opponent.y), opponentVectors);

		var response = new ploxfight.Response();	// resuse object instead?
		var collision = testPolygonPolygon(playerPolygon, opponentPolygon, response);
		if (collision) {
			opponent.x += response.overlapV.x;
			opponent.y += response.overlapV.y;
		}


	};

	var fixVector = function (x, y, vector) {
		vector.x = vector.x - x;
		vector.y = vector.y - y;
	};

	var testPolygonPolygon = function (a, b, response) {
		var aPoints = a.points;
		var aLen = aPoints.length;
		var bPoints = b.points;
		var bLen = bPoints.length;

		// If any of the edge normals of A is a separating axis, no intersection.
		while (aLen--) {
			if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, a.normals[aLen], response)) return false;
		}

		// If any of the edge normals of B is a separating axis, no intersection.
		while (bLen--) {
			if (isSeparatingAxis(a.pos, b.pos, aPoints, bPoints, b.normals[bLen], response)) return false;
		}

		// Since none of the edge normals of A or B are a separating axis, there is an intersection
		// and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
		// final overlap vector.
		if (response) {
			response.a = a;
			response.b = b;
			response.overlapV.copy(response.overlapN).scale(response.overlap);
		}
		return true;
	};

	var isSeparatingAxis = function (aPos, bPos, aPoints, bPoints, axis, response) {
		var rangeA = T_ARRAYS.pop();
		var rangeB = T_ARRAYS.pop();

		// Get the magnitude of the offset between the two polygons
		var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
		var projectedOffset = offsetV.dot(axis);

		// Project the polygons onto the axis.
		flattenPointsOn(aPoints, axis, rangeA);
		flattenPointsOn(bPoints, axis, rangeB);

		// Move B's range to its position relative to A.
		rangeB[0] += projectedOffset;
		rangeB[1] += projectedOffset;

		// Check if there is a gap. If there is, this is a separating axis and we can stop
		if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
			T_VECTORS.push(offsetV);
			T_ARRAYS.push(rangeA);
			T_ARRAYS.push(rangeB);
			return true;
		}

		// If we're calculating a response, calculate the overlap.
		if (response) {
			var overlap = 0;
			// A starts further left than B
			if (rangeA[0] < rangeB[0]) {
				response.aInB = false;
				// A ends before B does. We have to pull A out of B
				if (rangeA[1] < rangeB[1]) {
					overlap = rangeA[1] - rangeB[0];
					response.bInA = false;
					// B is fully inside A.  Pick the shortest way out.
				} else {
					var option1 = rangeA[1] - rangeB[0];
					var option2 = rangeB[1] - rangeA[0];
					overlap = option1 < option2 ? option1 : -option2;
				}
				// B starts further left than A
			} else {
				response.bInA = false;
				// B ends before A ends. We have to push A out of B
				if (rangeA[1] > rangeB[1]) {
					overlap = rangeA[0] - rangeB[1];
					response.aInB = false;
					// A is fully inside B.  Pick the shortest way out.
				} else {
					var option1 = rangeA[1] - rangeB[0];
					var option2 = rangeB[1] - rangeA[0];
					overlap = option1 < option2 ? option1 : -option2;
				}
			}

			// If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
			var absOverlap = Math.abs(overlap);
			if (absOverlap < response.overlap) {
				response.overlap = absOverlap;
				response.overlapN.copy(axis);
				if (overlap < 0) {
					response.overlapN.reverse();
				}
			}
		}

		T_VECTORS.push(offsetV);
		T_ARRAYS.push(rangeA);
		T_ARRAYS.push(rangeB);
		return false;
	};

	var flattenPointsOn = function (points, normal, result) {
		var min = Number.MAX_VALUE;
		var max = -Number.MAX_VALUE;
		var i = points.length;
		while (i--) {
			// Get the magnitude of the projection of the point onto the normal
			var temp = points[i];
			var dot = temp.dot(normal);
			if (dot < min) min = dot;
			if (dot > max) max = dot;
		}
		result[0] = min;
		result[1] = max;
	};

	/**
	 * Pool of Vectors used in calculations.
	 *
	 * @type {Array}
	 */
	var T_VECTORS = [];
	for (var i = 0; i < 10; i++) {
		T_VECTORS.push(new ploxfight.Vector());
	}

	/**
	 * Pool of Arrays used in calculations.
	 *
	 * @type {Array}
	 */
	var T_ARRAYS = [];
	for (var i = 0; i < 5; i++) {
		T_ARRAYS.push([]);
	}

	ploxfight.getSquareVectors = function (object) {
		var squareCorners = ploxfight.getSquareCorners(object);
		var result = [];
		for (var y = 0; y < squareCorners.length; y++) {
			var corner = squareCorners[y];
			result.push(new ploxfight.Vector(corner.x, corner.y));	//Onödig kopiering?
		}
		return result;
	};

	ploxfight.getSquareCorners = function (object) {
		//this.degree;
		//this.x = x;
		//this.y = y;
		//this.shapeWidth = 50;
		//this.shapeHeight = 50;

		var degree = -object.degree;	// WARNING: I use minus here and I'm not sure why it is needed...

		var TLx_pre = -object.shapeWidth / 2;
		var TLy_pre = -object.shapeHeight / 2;
		var TLx = object.x + ploxfight.rotateX(TLx_pre, TLy_pre, degree);
		var TLy = object.y + ploxfight.rotateY(TLx_pre, TLy_pre, degree);

		var TRx_pre = object.shapeWidth / 2;
		var TRy_pre = -object.shapeHeight / 2;
		var TRx = object.x + ploxfight.rotateX(TRx_pre, TRy_pre, degree);
		var TRy = object.y + ploxfight.rotateY(TRx_pre, TRy_pre, degree); //TODO: this is same as TLy... same for other points. Can be optimized.

		var BLx_pre = -object.shapeWidth / 2;
		var BLy_pre = +object.shapeHeight / 2;
		var BLx = object.x + ploxfight.rotateX(BLx_pre, BLy_pre, degree);
		var BLy = object.y + ploxfight.rotateY(BLx_pre, BLy_pre, degree);

		var BRx_pre = object.shapeWidth / 2;
		var BRy_pre = object.shapeHeight / 2;
		var BRx = object.x + ploxfight.rotateX(BRx_pre, BRy_pre, degree);
		var BRy = object.y + ploxfight.rotateY(BRx_pre, BRy_pre, degree);

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

	ploxfight.rotateX = function (x, y, degree) {
		return x * Math.cos(degree) - y * Math.sin(degree);
	};

	ploxfight.rotateY = function (x, y, degree) {
		return x * Math.sin(degree) + y * Math.cos(degree);
	};

})();