(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var game;
	var canvasX;
	var canvasY;
	var mouseX = 0;
	var mouseY = 0;

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
		}, 50);
	};

	var tic = function () {
		var xForce = mouseX - (canvasX + game.player.x);
		var yForce = mouseY - (canvasY + game.player.y);
		//console.log("force: " + xForce + ", " + yForce);
		var degree = Math.atan2(xForce, yForce);
		game.player.degree = degree;
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