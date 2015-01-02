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

		this.handleControl();
		this.updateBoard();
	};

	Tic.prototype.updateBoard = function () {
		this.checkPlayerState(this.game.player);
		//checkPlayerState(game.opponent);
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
							tile.health -= 10;
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

	Tic.prototype.handleControl = function () {

		if (this.game.player.height < ploxfight.HEIGHT_KILL_CONTROL) {
			return;
		}

		//var preX = game.player.x;
		//var preY = game.player.y;

		//player direction:
		var xForce = ploxfight.mouseX - (ploxfight.canvasX + this.game.player.x);
		var yForce = ploxfight.mouseY - (ploxfight.canvasY + this.game.player.y);
		var degree = Math.atan2(xForce, yForce);
		this.game.player.degree = degree;

		var playerSpeed = ploxfight.PLAYER_SPEED;
		if ((ploxfight.key_forward || ploxfight.key_back) && (ploxfight.key_left || ploxfight.key_right)) {
			playerSpeed = Math.sqrt((playerSpeed * playerSpeed) / 2);
		}

		//player motion:
		if (ploxfight.key_forward) {
			this.movePlayer(xForce, yForce, playerSpeed);
		}
		if (ploxfight.key_back) {
			this.movePlayer(-xForce, -yForce, playerSpeed);
		}
		if (ploxfight.key_left) {
			var leftDegree = degree + Math.PI / 2;
			var xForceLeft = Math.sin(leftDegree);
			var yForceLeft = Math.cos(leftDegree);
			this.movePlayer(xForceLeft, yForceLeft, playerSpeed);
		}
		if (ploxfight.key_right) {
			var rightDegree = degree - Math.PI / 2;
			var xForceRight = Math.sin(rightDegree);
			var yForceRight = Math.cos(rightDegree);
			this.movePlayer(xForceRight, yForceRight, playerSpeed);
		}

		//var postX = game.player.x;
		//var postY = game.player.y;
		//var diffX = Math.abs(postX - preX);
		//var diffY = Math.abs(postY - preY);
		//var totalMoved = Math.sqrt(diffX * diffX + diffY * diffY);
		//console.log("moved: " + totalMoved);
	};

	Tic.prototype.movePlayer = function (xForce, yForce, speed) {
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

		// We just multiply so it gets the length it is supposed to have
		var achievedSpeed = Math.sqrt(yChange * yChange + xChange * xChange);
		var adjust = speed / achievedSpeed;

		this.game.player.x += xChange * adjust;
		this.game.player.y += yChange * adjust;
	};
})();
