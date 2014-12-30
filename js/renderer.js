(function () {
	var ploxfight = window.ploxfight = window.ploxfight || {};

	ploxfight.PLAYER_WIDTH = 50;
	ploxfight.PLAYER_HEIGHT = 20;

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var image_player = document.getElementById('player');
	var image_opponent = document.getElementById('opponent');
	var image_tile0 = document.getElementById('tile-0');
	var image_tile1 = document.getElementById('tile-1');
	var image_tile2 = document.getElementById('tile-2');
	var image_water = document.getElementById('water');

	ploxfight.startRender = function () {
		var repeater = function () {
			setTimeout(function () {
				//console.log("repeating");
				render();
				repeater();
			}, 33);
		};
		repeater();
	};

	var render = function () {
		var game = ploxfight.getGame();
		var board = game.board;

		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < board.length; x++) {
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

		renderDude(game.player, image_player);
		renderDude(game.opponent, image_opponent);


		//paint a circle over the character:
		//context.beginPath();
		//context.arc(player.x, player.y, 3, 0, 2 * Math.PI, false);
		//context.fillStyle = 'green';
		//context.fill();
		//context.lineWidth = 5;
		//context.strokeStyle = '#003300';
		//context.stroke();
	};

	var renderDude = function (dude, image) {
		context.translate(dude.x, dude.y);
		context.rotate(-dude.degree);
		context.drawImage(image, -(ploxfight.PLAYER_WIDTH / 2), -(ploxfight.PLAYER_HEIGHT / 2));
		context.rotate(dude.degree);
		context.translate(-dude.x, -dude.y);
	}


})();