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

		this.barrels = [];
		this.barrels.push(new Barrel());

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
		return new Player(50, 50);
	};

	var newOpponent = function () {
		return new Player(225, 225);
	};

	ploxfight.Player = function Player(x, y) {
		this.health = 100;
		this.height = 0;
		this.degree = 0;
		this.x = x;
		this.y = y;
		this.shape = ploxfight.shape.SQUARE;
		this.shapeWidth = 50;
		this.shapeHeight = 20;
	};

	var Player = ploxfight.Player;

	ploxfight.Barrel = function Barrel(x, y) {
		this.health = 100;
		this.height = 0;
		this.degree = 0;
		this.x = x !== undefined ? x : Math.floor(75 + Math.random() * 100);
		this.y = y !== undefined ? y : Math.floor(75 + Math.random() * 100);
		this.shape = ploxfight.shape.CIRCLE;
		this.radius = 25;
	};

	var Barrel = ploxfight.Barrel;


})();