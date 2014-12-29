(function () {
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var image_tile0 = document.getElementById('tile-0');
	var image_tile1 = document.getElementById('tile-1');
	var image_tile2 = document.getElementById('tile-2');

	ploxfight.startRender = function () {
		var repeater = function () {
			setTimeout(function () {
				console.log("repeating");
				render();
				repeater();
			}, 200);
		};
		repeater();
	};

	var render = function () {
		var board = ploxfight.getBoard();

		for (var y = 0; y < board.length; y++) {
			var row = board[y];
			for (var x = 0; x < 5; x++) {
				var tile = row[x];
				if(tile > 75) {
					ctx.drawImage(image_tile0, x*50, y*50);
				} else if(tile > 50) {
					ctx.drawImage(image_tile1, x*50, y*50);
				} else if(tile > 0) {
					ctx.drawImage(image_tile2, x*50, y*50);
				}
			}
		}

		//ctx.drawImage(tile, 0, 0);
		//ctx.drawImage(tile, 50, 50);
	}

})();