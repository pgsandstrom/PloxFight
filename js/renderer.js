(function () {
	var ploxfight = window.ploxfight = window.ploxfight || {};

	ploxfight.PLAYER_WIDTH = 50;
	ploxfight.PLAYER_HEIGHT = 20;

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	var image_player = document.getElementById('player');
	var image_tile0 = document.getElementById('tile-0');
	var image_tile1 = document.getElementById('tile-1');
	var image_tile2 = document.getElementById('tile-2');

	ploxfight.startRender = function () {
		var repeater = function () {
			setTimeout(function () {
				//console.log("repeating");
				render();
				repeater();
			}, 50);
		};
		repeater();
	};

	var render = function () {
		var game = ploxfight.getGame();
		var board = game.board;

		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < 5; x++) {
				var tile = row[x];
				//console.log("tile at " + x * 50 + "," + y * 50);
				if (tile >= 75) {
					context.drawImage(image_tile0, x * 50, y * 50);
				} else if (tile >= 50) {
					context.drawImage(image_tile1, x * 50, y * 50);
				} else if (tile >= 0) {
					context.drawImage(image_tile2, x * 50, y * 50);
				}
			}
		}

		var player = game.player;

		context.translate(player.x, player.y);
		context.rotate(-player.degree);
		context.drawImage(image_player, -(ploxfight.PLAYER_WIDTH / 2), -(ploxfight.PLAYER_HEIGHT / 2));
		context.rotate(player.degree);
		context.translate(-player.x, -player.y);

		//paint a circle over the character:
		context.beginPath();
		context.arc(player.x, player.y, 3, 0, 2 * Math.PI, false);
		context.fillStyle = 'green';
		context.fill();
		context.lineWidth = 5;
		context.strokeStyle = '#003300';
		context.stroke();
	};


})();