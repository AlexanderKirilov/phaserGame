(function(GameState){
	var Game = (function(){
		function Game(game){
		    this.game;      //  a reference to the currently running game (Phaser.Game)
		    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
		    this.camera;    //  a reference to the game camera (Phaser.Camera)
		    this.cache;     //  the game cache (Phaser.Cache)
		    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
		    this.load;      //  for preloading assets (Phaser.Loader)
		    this.math;      //  lots of useful common math operations (Phaser.Math)
		    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
		    this.stage;     //  the game stage (Phaser.Stage)
		    this.time;      //  the clock (Phaser.Time)
		    this.tweens;    //  the tween manager (Phaser.TweenManager)
		    this.state;     //  the state manager (Phaser.StateManager)
		    this.world;     //  the game world (Phaser.World)
		    this.particles; //  the particle manager (Phaser.Particles)
		    this.physics;   //  the physics manager (Phaser.Physics)
		    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

		    this.player;
		    this.cursors;
		}
		Game.prototype.create = function(){
			//add level background
			var levelBg = this.game.add.sprite(0, 0, 'bg');

			//DEBUG:
			window.game = this.game;

			//initiate world
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.world.setBounds(0, 0, levelBg.width, levelBg.height);
			this.game.time.advancedTiming = true;

			//disable smoothing for pixel art
			this.game.stage.smoothed = false;
			this.game.renderer.renderSession.roundPixels = true;

			//create player
			this.player = new Player(this.game, 40, 180);

			//set the camera follow to be more beat em up style;
			var camDeadzoneWidth = Math.floor((gameConfig.gameWidth*4)/5 - this.player.width);
			var camDeadzoneHeight = gameConfig.gameHeight;
			this.game.camera.deadzone = new Phaser.Rectangle(0, -10, camDeadzoneWidth, camDeadzoneHeight);
		};
		Game.prototype.update = function(){
			this.player.update();
		};
		Game.prototype.render = function(){
	        /* show the camera deadzone
	        var zone = game.camera.deadzone;
	        game.debug.context.fillStyle = 'rgba(255,0,0,0.6)';
	        game.debug.context.fillRect(zone.x, zone.y, zone.width+player.width, zone.height);
	        */

	        /*  show the camera debug info
	        this.game.debug.cameraInfo(game.camera, 32, 32);
	        this.game.debug.spriteCoords(player, 32, 500);
	        */

	        /*  show the player bounding box; */
	        this.game.debug.context.fillStyle = 'rgba(255,0,0,0.6)';
	        this.game.debug.context.fillRect(this.player.x, this.player.y, this.player.width, -this.player.height);
	        
	        this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
    	};
    	Game.prototype.quitGame = function(pointer){
    		this.state.start('MainMenu');
    	};
		return Game;
	})();
	GameState.Game = Game;
})(GameState || {});
