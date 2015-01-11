(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	ploxfight.gameTest = function() {
		var eventTrigger = function(game) {
			//TODO: denna ska gå på tid, inte tics...
			if(game.tic.ticCount % 100 === 0) {
				game.opponents.push(this.newOpponent());
			}
		};

		return new ploxfight.Game(eventTrigger);
	};


	//ploxfight.TempGame = function Game(eventTrigger) {
	//	this.eventTrigger = eventTrigger;
	//
	//	this.playerIdGenerator = 0;
	//	this.running = true;
	//	this.board = this.newBoard();
	//	this.player = this.newPlayer();
	//	this.opponents = [];
	//	this.opponents.push(this.newOpponent());
	//	//this.opponents.push(this.newOpponent());
	//
	//	this.barrels = [];
	//	this.barrels.push(new ploxfight.Barrel());
	//	this.barrels.push(new ploxfight.Barrel());
	//
	//	var $canvas = $("#canvas");	//TODO move this stuff?
	//	ploxfight.canvasX = $canvas.offset().left;
	//	ploxfight.canvasY = $canvas.offset().top;
	//
	//	ploxfight.startControl();	//TODO where to place control.js code?
	//
	//	this.renderer = new ploxfight.Renderer(this);
	//	this.renderer.startRender();
	//
	//	this.tic = new ploxfight.Tic(this);
	//	this.tic.startTic();
	//};

})();