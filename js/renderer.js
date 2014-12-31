(function () {
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var PLAYER_IMAGE_SIZE = 50;

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var image_player = document.getElementById('player');
	var image_opponent = document.getElementById('opponent');
	var image_tile0 = document.getElementById('tile-0');
	var image_tile1 = document.getElementById('tile-1');
	var image_tile2 = document.getElementById('tile-2');
	var image_water = document.getElementById('water');

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
				if (tile >= 750) {
					context.drawImage(image_tile0, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile >= 500) {
					context.drawImage(image_tile1, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else if (tile > 0) {
					context.drawImage(image_tile2, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				} else {
					context.drawImage(image_water, x * ploxfight.TILE_SIZE, y * ploxfight.TILE_SIZE);
				}
			}
		}

		this.renderDude(this.game.player, image_player);
		this.renderDude(this.game.opponent, image_opponent);


		//paint a circle over the character:
		//context.beginPath();
		//context.arc(player.x, player.y, 3, 0, 2 * Math.PI, false);
		//context.fillStyle = 'green';
		//context.fill();
		//context.lineWidth = 5;
		//context.strokeStyle = '#003300';
		//context.stroke();
	};

	Renderer.prototype.renderDude = function (dude, image) {
		context.translate(dude.x, dude.y);
		context.rotate(-dude.degree);
		var scale = ((dude.height + ploxfight.TILE_HEIGHT) / ploxfight.TILE_HEIGHT);
		var size = PLAYER_IMAGE_SIZE * scale;
		var offset = -(PLAYER_IMAGE_SIZE / 2)	//The image should be drawn with the middle on our (x,y), not the corner.
			+ (PLAYER_IMAGE_SIZE / 2) * (-scale + 1); //when the image shrinks, we need to adjust offset. 0 when scale=1, 0.5 when scale=0.
		context.drawImage(image, offset, offset, size, size);
		context.rotate(dude.degree);
		context.translate(-dude.x, -dude.y);
	}


})();