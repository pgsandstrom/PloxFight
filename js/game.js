(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	//TODO: Fixa så det alltid tar 33, även om ticet tar tid att utföra
	ploxfight.TIC_TIME = 33;
	ploxfight.PLAYER_SPEED = 6;
	ploxfight.TILE_SIZE = 50;
	ploxfight.TILE_HEIGHT = 100;	//the board is at height 0, the water is at -100

	ploxfight.key_forward = false;
	ploxfight.key_left = false;
	ploxfight.key_right = false;
	ploxfight.key_back = false;


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

		game = {running: true};
		game.board = newBoard();
		game.player = newPlayer();
		game.opponent = newOpponent();


		ploxfight.startRender();
		ticRepeater();
	};

	var ticRepeater = function () {
		setTimeout(function () {
			tic();
			if (game.running) {
				ticRepeater();
			}
		}, ploxfight.TIC_TIME);
	};

	var tic = function () {

		handleControl();
		updateBoard();
	};

	var updateBoard = function () {
		checkPlayerState(game.player);
		//checkPlayerState(game.opponent);
	};

	var checkPlayerState = function (player) {

		if (player.height < 0) {
			player.height--;
			if (player.height <= -ploxfight.TILE_HEIGHT) {
				dudeDeath(player);
			}
			return;
		}

		var board = game.board;
		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < 5; x++) {
				var tileX = x * ploxfight.TILE_SIZE;
				var tileY = y * ploxfight.TILE_SIZE;
				if (player.x > tileX && player.x < tileX + ploxfight.TILE_SIZE && player.y > tileY && player.y < tileY + ploxfight.TILE_SIZE) {
					var tile = row[x];
					if (tile <= 0) {
						playerFall(player);
					} else {
						row[x] = tile - 10;
					}
				}
			}
		}
	};

	var playerFall = function (player) {
		player.height = -2;
	};

	var dudeDeath = function (player) {
		game.running = false;
	};

	var handleControl = function () {

		if (game.player.height < 0) {
			return;
		}

		//var preX = game.player.x;
		//var preY = game.player.y;

		//player direction:
		var xForce = mouseX - (canvasX + game.player.x);
		var yForce = mouseY - (canvasY + game.player.y);
		var degree = Math.atan2(xForce, yForce);
		game.player.degree = degree;

		var playerSpeed = ploxfight.PLAYER_SPEED;
		if ((ploxfight.key_forward || ploxfight.key_back) && (ploxfight.key_left || ploxfight.key_right)) {
			playerSpeed = Math.sqrt((playerSpeed * playerSpeed) / 2);
		}

		//player motion:
		if (ploxfight.key_forward) {
			movePlayer(xForce, yForce, playerSpeed);
		}
		if (ploxfight.key_back) {
			movePlayer(-xForce, -yForce, playerSpeed);
		}
		if (ploxfight.key_left) {
			var leftDegree = degree + Math.PI / 2;
			var xForceLeft = Math.sin(leftDegree);
			var yForceLeft = Math.cos(leftDegree);
			movePlayer(xForceLeft, yForceLeft, playerSpeed);
		}
		if (ploxfight.key_right) {
			var rightDegree = degree - Math.PI / 2;
			var xForceRight = Math.sin(rightDegree);
			var yForceRight = Math.cos(rightDegree);
			movePlayer(xForceRight, yForceRight, playerSpeed);
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

		// We just multiply so it gets the length it is supposed to have
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
		return Math.floor(250 + Math.random() * 750);
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

	ploxfight.getGame = function () {
		return game;
	};

	ploxfight.getDistance = function (x1, y1, x2, y2) {
		var xDiff = Math.abs(x1 - x2);
		var yDiff = Math.abs(y1 - y2);
		return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	}
})();