(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};


	ploxfight.Tic = function Tic(game) {
		this.game = game;
	};

	var Tic = ploxfight.Tic;

	Tic.prototype.startTic = function () {
		this.ticRepeater();
	};

	Tic.prototype.ticRepeater = function () {
		var tic = this;
		setTimeout(function () {
			tic.tic();
			if (tic.game.running) {
				tic.ticRepeater();
			}
		}, ploxfight.TIC_TIME);
	};

	Tic.prototype.tic = function () {

		this.handleControl(this.game.player);
		if (this.game.opponent !== undefined) {
			ploxfight.ai(this.game, this.game.opponent);
		}
		this.updateBoard();
	};

	Tic.prototype.updateBoard = function () {
		this.updateTiles();
		this.updateBarrels();
		this.checkPlayerState(this.game.player);
		if (this.game.opponent !== undefined) {
			this.checkPlayerState(this.game.opponent);
		}

		this.updateCollisions();
	};

	Tic.prototype.updateTiles = function () {
		var board = this.game.board;
		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < board.length; x++) {
				var tile = row[x];
				// If tile is dead, animate:
				if (tile.health <= 0) {
					if (tile.breaking > 0) {
						tile.breaking -= ploxfight.TIC_TIME;
					} else {
						this.objectFall(tile);
					}
				}
			}
		}
	};

	Tic.prototype.updateBarrels = function () {
		for (var i = 0; i < this.game.barrels.length; i++) {
			var barrel = this.game.barrels[i];
			var tile = this.game.board[(barrel.y / ploxfight.TILE_SIZE) | 0][(barrel.x / ploxfight.TILE_SIZE) | 0];
			if (tile.breaking <= 0) {
				this.objectFall(barrel);
			}
		}

	};

	Tic.prototype.checkPlayerState = function (player) {
		if (player.height <= -ploxfight.TILE_HEIGHT) {
			this.dudeDeath(player);
		}

		var tile = this.game.board[(player.y / ploxfight.TILE_SIZE) | 0][(player.x / ploxfight.TILE_SIZE) | 0];
		if (tile.breaking <= 0) {
			this.objectFall(player);
		} else {
			if (tile.health > 0) {
				tile.health -= 10;
			}
			if (tile.breaking > 0 && player.height < 0) {	// Abort falling
				player.height = 0;
			}
		}
	};

	Tic.prototype.objectFall = function (object) {
		if (object.height > -ploxfight.TILE_HEIGHT) {
			object.height = object.height - 2;
			if (object.height < -ploxfight.TILE_HEIGHT) {
				object.height = -ploxfight.TILE_HEIGHT;
			}
		}
	};

	Tic.prototype.dudeDeath = function (player) {
		this.game.running = false;
	};

	Tic.prototype.handleControl = function (player) {

		if (player.height < ploxfight.HEIGHT_KILL_CONTROL) {
			return;
		}

		//var preX = game.player.x;
		//var preY = game.player.y;

		//player direction:
		var xForce = ploxfight.mouseX - (ploxfight.canvasX + player.x);
		var yForce = ploxfight.mouseY - (ploxfight.canvasY + player.y);
		var degree = Math.atan2(xForce, yForce);
		player.degree = degree;

		var moves = {};

		//player motion:
		moves[ploxfight.MOVE_FORWARD] = ploxfight.key_forward;
		moves[ploxfight.MOVE_BACKWARD] = ploxfight.key_back;
		moves[ploxfight.MOVE_LEFT] = ploxfight.key_left;
		moves[ploxfight.MOVE_RIGHT] = ploxfight.key_right;

		ploxfight.moveDude(player, moves);

		//var postX = game.player.x;
		//var postY = game.player.y;
		//var diffX = Math.abs(postX - preX);
		//var diffY = Math.abs(postY - preY);
		//var totalMoved = Math.sqrt(diffX * diffX + diffY * diffY);
		//console.log("moved: " + totalMoved);
	};

	Tic.prototype.updateCollisions = function () {
		var collisionables = [];
		collisionables.push(this.game.player);
		if (this.game.opponent !== undefined) {
			collisionables.push(this.game.opponent);
		}
		collisionables.push.apply(collisionables, this.game.barrels);
		for (var i = 0; i < collisionables.length; i++) {
			var object1 = collisionables[i];
			for (var j = i + 1; j < collisionables.length; j++) {
				var object2 = collisionables[j];
				ploxfight.checkCollisions(object1, object2);
			}
		}
	}

})();
