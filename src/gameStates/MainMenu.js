(function(GameState){
	var MainMenu = (function(){
		function MainMenu(game){
			this.tweenTitleScreenBg;
			this.titleScreen;
		}
		//TODO	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		MainMenu.prototype.create = function(){
			var self = this;
			this.titleScreen = this.game.add.sprite(gameConfig.gameWidth/2, gameConfig.gameHeight/2,'titleScreenBG');
			this.titleScreen.width = gameConfig.gameHeight*1.2868;
			this.titleScreen.height = gameConfig.gameHeight;
			this.titleScreen.anchor.setTo(0.5,0.5);
			//handle bg click
			this.titleScreen.inputEnabled = true;
			this.titleScreen.events.onInputDown.add(function(){
				self.tweenTitleScreenBg.start();
			}, this);
			//set up the tween
			this.tweenTitleScreenBg = this.game.add.tween(this.titleScreen).to({alpha:0}, 1000, Phaser.Easing.Cubic.Out);
			// start Game after tween fadeOut
			this.tweenTitleScreenBg.onComplete.add(function(){
				self.state.start('Game');
			});
		};
		MainMenu.prototype.update = function () {
			//	Do some nice funky main menu effect here
		};
		return MainMenu;
	})();
	GameState.MainMenu = MainMenu;
})(GameState || {});
