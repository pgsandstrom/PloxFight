(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	//TODO: Fixa så det alltid tar 33, även om ticet tar tid att utföra
	ploxfight.TIC_TIME = 33;
	ploxfight.PLAYER_SPEED = 6;
	ploxfight.TILE_SIZE = 50;
	ploxfight.TILE_HEIGHT = 100;	//the board is at height 0, the water is at -100
	ploxfight.HEIGHT_KILL_CONTROL = -12;	//the board is at height 0, the water is at -100

	ploxfight.key_forward = false;
	ploxfight.key_left = false;
	ploxfight.key_right = false;
	ploxfight.key_back = false;

	ploxfight.mouseX = 0;
	ploxfight.mouseY = 0;

	//ploxfight.canvasX;
	//ploxfight.canvasY;

	$(function () {
		// Fugly wait for images to load
		setTimeout(function () {
			var game = new Game();
		}, 100);
	});


	ploxfight.Game = function Game() {
		this.running = true;
		this.board = newBoard();
		this.player = newPlayer();
		this.opponent = newOpponent();

		var $canvas = $("#canvas");	//TODO move this stuff?
		ploxfight.canvasX = $canvas.offset().left;
		ploxfight.canvasY = $canvas.offset().top;

		ploxfight.startControl();	//TODO where to place control.js code?

		this.renderer = new ploxfight.Renderer(this);
		this.renderer.startRender();

		this.tic = new ploxfight.Tic(this);
		this.tic.startTic();
	};

	var Game = ploxfight.Game;

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
		return {
			health: Math.floor(250 + Math.random() * 750),
			breaking: 1000,
			falling: 1000
		}
	};

	var newPlayer = function () {
		return {
			health: 100,
			height: 0,
			degree: 0,
			x: 50,
			y: 50
		}
	};

	var newOpponent = function () {
		return {
			health: 100,
			height: 0,
			degree: 0,
			x: 225,
			y: 225
		}
	};

	ploxfight.getDistance = function (x1, y1, x2, y2) {
		var xDiff = Math.abs(x1 - x2);
		var yDiff = Math.abs(y1 - y2);
		return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	}
})();