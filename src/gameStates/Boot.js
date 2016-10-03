var GameState = {};
(function(GameState){
	var Boot = (function(){
		function Boot(game){

		}
		Boot.prototype.init = function(){
			this.input.maxPointers = 1;
    		this.game.renderer.renderSession.roundPixels = true;
    
			if (this.game.device.desktop){
				//any desktop specific settings go in here
				this.scale.pageAlignHorizontally = true;
	        }else{
				// mobile settings.
				//TODO: "scale the game, no lower than 480x260 and no higher than 1024x768"
				//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
				//this.scale.setMinMax(480, 260, 1024, 768);
				this.scale.forceLandscape = true;
				this.scale.pageAlignHorizontally = true;
			}
		};
		Boot.prototype.preload = function(){
			//  Here we load the assets required for our preloader (in this case a background and a loading bar)
		};
		Boot.prototype.create = function(){
			this.state.start('Preloader');
		};
		return Boot;
	})();
	GameState.Boot = Boot;
})(GameState || {});
