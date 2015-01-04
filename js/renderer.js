(function () {
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var PLAYER_IMAGE_SIZE = 50;
	var BARREL_IMAGE_SIZE = 50;

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var image_player = document.getElementById('player');
	var image_opponent = document.getElementById('opponent');
	var image_tile1 = document.getElementById('tile-1');
	var image_tile2 = document.getElementById('tile-2');
	var image_tile3 = document.getElementById('tile-3');
	var image_tile_breaking_1 = document.getElementById('tile-breaking-1');
	var image_tile_breaking_2 = document.getElementById('tile-breaking-2');
	var image_tile_breaking_3 = document.getElementById('tile-breaking-3');
	var image_tile_breaking_4 = document.getElementById('tile-breaking-4');
	var image_tile_breaking_5 = document.getElementById('tile-breaking-5');
	var image_tile_falling_1 = document.getElementById('tile-falling-1');
	var image_water = document.getElementById('water');
	var image_barrel = document.getElementById('barrel');

	ploxfight.Renderer = function Renderer(game) {
		this.game = game;
	};

	var Renderer = ploxfight.Renderer;

	Renderer.prototype.startRender = function () {
		var renderer = this;
		var repeater = function () {
			setTimeout(function () {
				//console.log("repeating");
				renderer.render();
				if (renderer.game.running) {
					repeater();
				}
			}, 33);
		};
		repeater();
	};

	Renderer.prototype.render = function () {
		var board = this.game.board;

		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < row.length; x++) {
				var tile = row[x];
				//console.log("tile at " + x * 50 + "," + y * 50);
				if (tile.health >= 750) {
					context.drawImage(image_tile1, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.health >= 500) {
					context.drawImage(image_tile2, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.health > 0) {
					context.drawImage(image_tile3, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.breaking > 800) {
					context.drawImage(image_tile_breaking_1, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.breaking > 600) {
					context.drawImage(image_tile_breaking_2, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.breaking > 400) {
					context.drawImage(image_tile_breaking_3, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.breaking > 200) {
					context.drawImage(image_tile_breaking_4, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.breaking > 0) {
					context.drawImage(image_tile_breaking_5, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile.height > -ploxfight.TILE_HEIGHT) {
					context.drawImage(image_water, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
					var object = {
						x: (x + 0.5) * ploxfight.TILE_SIZE,
						y: (y + 0.5) * ploxfight.TILE_SIZE,
						height: tile.height
					};
					renderObject(object, image_tile_falling_1, ploxfight.TILE_SIZE);
				} else {
					context.drawImage(image_water, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				}
			}
		}

		this.renderDude(this.game.player, image_player);
		if (this.game.opponent !== undefined) {
			this.renderDude(this.game.opponent, image_opponent);
		}

		for (var i = 0; i < this.game.barrels.length; i++) {
			this.renderBarrel(this.game.barrels[i]);
		}

		//paint a circle over the character:
		//context.beginPath();
		//context.arc(player.x, player.y, 3, 0, 2 * Math.PI, false);
		//context.fillStyle = 'green';
		//context.fill();
		//context.lineWidth = 5;
		//context.strokeStyle = '#003300';
		//context.stroke();
	};

	Renderer.prototype.renderBarrel = function (barrel) {
		renderObject(barrel, image_barrel, BARREL_IMAGE_SIZE);
	};

	Renderer.prototype.renderDude = function (dude, image) {
		renderObject(dude, image, PLAYER_IMAGE_SIZE);
	};

	var renderObject = function (object, image, imageSize) {
		context.translate(object.x, object.y);
		context.rotate(-object.degree);
		var scale = ((object.height + ploxfight.TILE_HEIGHT) / ploxfight.TILE_HEIGHT);
		var size = imageSize * scale;
		var offset = -(imageSize / 2)	// The image should be drawn with the middle on our (x,y), not the corner.
			+ (imageSize / 2) * (-scale + 1); // When the image shrinks, we need to adjust offset. 0 when scale=1, 0.5 when scale=0.
		context.drawImage(image, offset, offset, size, size);
		context.rotate(object.degree);
		context.translate(-object.x, -object.y);

		//var squareCorners = ploxfight.getSquareCorners(dude);
		//for (var y = 0; y < squareCorners.length; y++) {
		//	var first;
		//	if (y === 0) {
		//		first = squareCorners[squareCorners.length - 1];
		//	} else {
		//		first = squareCorners[y - 1];
		//	}
		//	var second = squareCorners[y];
		//
		//	context.beginPath();
		//	context.moveTo(first.x, first.y);
		//	context.lineTo(second.x, second.y);
		//	context.stroke();
		//}
	}
})();