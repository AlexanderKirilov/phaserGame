var GameState = {};
(function(GameState){
	var Boot = (function(){
		function Boot(game){

		}
		Boot.prototype.init = function(){
			this.input.maxPointers = 1;
			this.game.stage.smoothed = false;
    		this.game.renderer.renderSession.roundPixels = false;
    		this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    		this.game.scale.pageAlignVertically = true;
			this.scale.pageAlignHorizontally = true;
			if (this.game.device.desktop){
				//any desktop specific settings go in here
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
		     // Preloader graphics
		    var preloaderfg = this.game.add.bitmapData(250, 1, 'preloader-fg', true);
		    ctx = preloaderfg.context;
		    ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
		    ctx.fillRect(0, 0, 250, 1);
		    var preloaderbg = this.game.add.bitmapData(250, 1, 'preloader-bg', true);
		    ctx = preloaderbg.context;
		    ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
		    ctx.fillRect(0, 0, 250, 1);
		};
		Boot.prototype.create = function(){
			this.state.start('Preloader');
		};
		return Boot;
	})();
	GameState.Boot = Boot;
})(GameState || {});
