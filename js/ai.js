(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var temp = 30;

	ploxfight.ai = function (game, dude) {
		var xForce = game.player.x - (ploxfight.canvasX + dude.x);
		var yForce = game.player.y - (ploxfight.canvasY + dude.y);
		var degree = Math.atan2(xForce, yForce);
		dude.degree = degree;

		var moves = {};

		//player motion:
		if (temp === 0) {
			moves[ploxfight.MOVE_FORWARD] = true;
		} else {
			temp--;
		}

		ploxfight.moveDude(dude, moves);
	};

})();