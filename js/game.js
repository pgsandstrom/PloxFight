(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var game;
	var canvasX;
	var canvasY;
	var mouseX = 0;
	var mouseY = 0;

	ploxfight.key_forward = false;
	ploxfight.key_left = false;
	ploxfight.key_right = false;
	ploxfight.key_back = false;

	$(function () {
		// Fugly wait for images to load
		setTimeout(function () {
			startGame()
		}, 100);
	});
	var startGame = function () {
		var $canvas = $("#canvas");
		canvasX = $canvas.offset().left;
		canvasY = $canvas.offset().top;

		$canvas.mousemove(function (event) {
			mouseX = event.pageX;
			mouseY = event.pageY;
		});

		$(document).keydown(function (e) {
			if (e.which == 87) { //w
				ploxfight.key_forward = true;
			}
			if (e.which == 65) { //a
				ploxfight.key_left = true;
			}
			if (e.which == 83) { //s
				ploxfight.key_back = true;
			}
			if (e.which == 68) { //d
				ploxfight.key_right = true;
			}
		});

		$(document).keyup(function (e) {
			if (e.which == 87) { //w
				ploxfight.key_forward = false;
			}
			if (e.which == 65) { //a
				ploxfight.key_left = false;
			}
			if (e.which == 83) { //s
				ploxfight.key_back = false;
			}
			if (e.which == 68) { //d
				ploxfight.key_right = false;
			}
		});

		game = {};
		game.board = newBoard();
		game.player = newPlayer();


		ploxfight.startRender();
		ticRepeater();
	};

	var ticRepeater = function () {
		setTimeout(function () {
			tic();
			ticRepeater();
		}, 33);
	};

	var tic = function () {

		//var preX = game.player.x;
		//var preY = game.player.y;

		var speed = 6;

		//player direction:
		var xForce = mouseX - (canvasX + game.player.x);
		var yForce = mouseY - (canvasY + game.player.y);
		var degree = Math.atan2(xForce, yForce);
		game.player.degree = degree;

		if ((ploxfight.key_forward || ploxfight.key_back) && (ploxfight.key_left || ploxfight.key_right)) {
			speed = Math.sqrt((speed * speed) / 2);
		}

		//player motion:
		if (ploxfight.key_forward) {
			movePlayer(xForce, yForce, speed);
		}
		if (ploxfight.key_back) {
			movePlayer(-xForce, -yForce, speed);
		}
		if (ploxfight.key_left) {
			var leftDegree = degree + Math.PI / 2;
			var xForceLeft = Math.sin(leftDegree);
			var yForceLeft = Math.cos(leftDegree);
			movePlayer(xForceLeft, yForceLeft, speed);
		}
		if (ploxfight.key_right) {
			var rightDegree = degree - Math.PI / 2;
			var xForceRight = Math.sin(rightDegree);
			var yForceRight = Math.cos(rightDegree);
			movePlayer(xForceRight, yForceRight, speed);
		}

		//var postX = game.player.x;
		//var postY = game.player.y;
		//var diffX = Math.abs(postX - preX);
		//var diffY = Math.abs(postY - preY);
		//var totalMoved = Math.sqrt(diffX * diffX + diffY * diffY);
		//console.log("moved: " + totalMoved);
	};

	var movePlayer = function (xForce, yForce, speed) {
		var xAbs = Math.abs(xForce);
		var yAbs = Math.abs(yForce);

		var xQuota = xAbs / (xAbs + yAbs);
		var yQuota = 1 - xQuota;

		var xChange = xQuota;
		if (xForce < 0) {
			xChange *= -1;
		}
		var yChange = yQuota;
		if (yForce < 0) {
			yChange *= -1;
		}

		var achievedSpeed = Math.sqrt(yChange * yChange + xChange * xChange);
		var adjust = speed / achievedSpeed;

		game.player.x += xChange * adjust;
		game.player.y += yChange * adjust;
	};

	var newBoard = function () {
		var board = [];

		for (var y = 0; y < 5; y++) {
			var row = [];
			board.push(row);
			for (var x = 0; x < 5; x++) {
				row.push(newTile());
			}
		}
		return board;
	};
	var newTile = function () {
		return Math.floor(Math.random() * 100);
	};

	var newPlayer = function () {
		return {
			degree: 0,
			x: 50,
			y: 50
		}
	};

	ploxfight.getGame = function () {
		return game;
	}
})();