(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var temp = 50;

	ploxfight.ai = function (game, dude) {

		if (dude.height < ploxfight.HEIGHT_KILL_CONTROL) {
			return;
		}

		if (dude.tumbleProgress > 0) {
			return;
		}

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

		ploxfight.updateDude(dude, moves);
	};

})();