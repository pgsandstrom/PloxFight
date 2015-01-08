(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	ploxfight.RENDER_TIC_TIME = 33;
	ploxfight.GAME_TIC_TIME = 33;

	ploxfight.PLAYER_SPEED = 6;
	ploxfight.TUMBLE_SPEED = 12;
	ploxfight.FIST_TIME = 300;
	ploxfight.TUMBLE_TIME = 300;

	ploxfight.BOARD_SIZE = 10;
	ploxfight.TILE_SIZE = 50;
	ploxfight.TILE_HEIGHT = 100;	//the board is at height 0, the water is at -100
	ploxfight.HEIGHT_KILL_CONTROL = -12;	//the board is at height 0, the water is at -100

	ploxfight.key_forward = false;
	ploxfight.key_left = false;
	ploxfight.key_right = false;
	ploxfight.key_back = false;
	ploxfight.key_hit = false;

	ploxfight.mouseX = 0;
	ploxfight.mouseY = 0;

	//ploxfight.canvasX;
	//ploxfight.canvasY;

	$(function () {
		// Fugly wait for images to load
		setTimeout(function () {
			ploxfight.game = new Game();
		}, 100);
	});


	ploxfight.Game = function Game() {
		this.playerIdGenerator = 0;
		this.running = true;
		this.board = this.newBoard();
		this.player = this.newPlayer();
		this.opponents = [];
		this.opponents.push(this.newOpponent());
		//this.opponents.push(this.newOpponent());

		this.barrels = [];
		this.barrels.push(new Barrel());
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

	Game.prototype.newBoard = function () {
		var board = [];

		for (var y = 0; y < ploxfight.BOARD_SIZE; y++) {
			var row = [];
			board.push(row);
			for (var x = 0; x < ploxfight.BOARD_SIZE; x++) {
				if (y === 0 || y === ploxfight.BOARD_SIZE - 1 || x === 0 || x === ploxfight.BOARD_SIZE - 1) {
					row.push(newTile(0));
				} else {
					row.push(newTile());
				}
			}
		}
		return board;
	};

	var newTile = function (health) {
		var tileHeath = health !== undefined ? health : Math.floor(250 + Math.random() * 750);
		var breaking = health === 0 ? 0 : 1000;
		var height = health === 0 ? -ploxfight.TILE_HEIGHT : 0;
		return {
			health: tileHeath,
			breaking: breaking,
			height: height
		}
	};

	Game.prototype.newPlayer = function () {
		return new Player(this.playerIdGenerator++, 75, 75);
	};

	Game.prototype.newOpponent = function () {
		return new Player(this.playerIdGenerator++, 425, 425);
	};

	ploxfight.Player = function Player(id, x, y) {
		this.type = "dude";
		this.id = id;
		this.health = 100;
		this.height = 0;
		this.degree = 0;
		this.x = x;
		this.y = y;
		this.shape = ploxfight.shape.SQUARE;
		this.shapeWidth = 50;
		this.shapeHeight = 20;
		this.pushability = 100;

		this.fistProgress = 0;
		this.tumbleProgress = 0;
	};

	var Player = ploxfight.Player;

	ploxfight.Barrel = function Barrel(x, y) {
		this.type = "barrel";
		this.health = 100;
		this.height = 0;
		this.degree = 0;
		this.x = x !== undefined ? x : Math.floor(75 + Math.random() * 225);
		this.y = y !== undefined ? y : Math.floor(75 + Math.random() * 225);
		this.shape = ploxfight.shape.CIRCLE;
		this.radius = 25;
		this.pushability = 100;
	};

	var Barrel = ploxfight.Barrel;


})();