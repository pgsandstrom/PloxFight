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
		ploxfight.ai(this.game, this.game.opponent);
		this.updateBoard();
	};

	Tic.prototype.updateBoard = function () {
		this.checkPlayerState(this.game.player);
		this.checkPlayerState(this.game.opponent);
		var collisionables = [];
		collisionables.push(this.game.player);
		collisionables.push(this.game.opponent);
		collisionables.push.apply(collisionables, this.game.barrels);
		for (var i = 0; i < collisionables.length; i++) {
			var object1 = collisionables[i];
			for (var j = i + 1; j < collisionables.length; j++) {
				var object2 = collisionables[j];
				ploxfight.checkCollisions(object1, object2);
			}
		}
	};

	Tic.prototype.checkPlayerState = function (player) {

		if (player.height <= -ploxfight.TILE_HEIGHT) {
			this.dudeDeath(player);
		}
		var board = this.game.board;
		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < 5; x++) {
				var tileX = x * ploxfight.TILE_SIZE;
				var tileY = y * ploxfight.TILE_SIZE;
				var tile = row[x];
				// If player are standing on tile:
				if (player.x > tileX && player.x < tileX + ploxfight.TILE_SIZE && player.y > tileY && player.y < tileY + ploxfight.TILE_SIZE) {
					if (tile.breaking <= 0) {
						this.playerFall(player);
					} else {
						if (tile.health > 0) {
							//tile.health -= 10;	//TODO removed temporarily!
						}
						if (tile.breaking > 0 && player.height < 0) {	// Abort falling
							player.height = 0;
						}
					}
				}
				// If tile is dead:
				if (tile.health <= 0) {
					if (tile.breaking > 0) {
						tile.breaking -= ploxfight.TIC_TIME;
					} else if (tile.falling > 0) {
						tile.falling -= ploxfight.TIC_TIME;
					}
				}
			}
		}
	};

	Tic.prototype.playerFall = function (player) {
		player.height = player.height - 2;
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

})();
