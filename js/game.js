(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var board;

	$(function () {
		// Fugly wait for images to load
		setTimeout(function () {
			startGame()
		}, 100);
	});
	var startGame = function () {
		$("#canvas").mousemove(function (event) {
//		console.log("plox: " + event.pageY);
		});

		board = newBoard();


		ploxfight.startRender();
	};

	var newBoard = function () {
		var board = [[]];

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
		return Math.random()*100;
	};

	ploxfight.getBoard = function () {
		return board;
	}
})();