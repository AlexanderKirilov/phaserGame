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
		    this.abbo;

		    window.game = game;
		}
		Game.prototype.create = function(){
	        this.game.debug.context.fillStyle = 'rgba(255,0,0,0.6)';
			//disable smoothing for pixel art
			this.game.stage.smoothed = false;
			this.game.renderer.renderSession.roundPixels = true;
			//add level background
			var levelBg = this.game.add.sprite(0, 0, 'bg');

			//initiate world
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.world.setBounds(0, 0, levelBg.width, levelBg.height);
			this.game.time.advancedTiming = true;
			
			/* Background level animations */
			// fire animation (560, 120)
			this.fire = new Fire (this.game, 560, 120);
			//
			//Left gang animation
			var leftGang = game.add.sprite (490, 86, 'left_gang');
			leftGang.animations.add('stay');
			leftGang.animations.play('stay', 2, true);
			//
			//Right gang animation
			var rightGang = game.add.sprite (591, 78, 'right_gang');
			rightGang.animations.add('stay');
			rightGang.animations.play('stay', 2, true);

			
			// create final  boss (Abbobo)
			this.abbo = new Abbo(this.game, 1300, 200);

			//create player
			this.player = new Player(this.game, 40, 180);
			
			// define enemy spawn positions			
			var enemyX;
			var enemyY;
			
			// spawn first group of enemies
			for (var i = 0; i < 4; i++) {
				enemyX = Math.floor(50 + Math.random() * 500);
				enemyY = Math.floor(174 + Math.random() * 65);
				this.enemy = new Enemy(this.game, enemyX, enemyY);
			}
			

			//set the camera follow to be more beat em up style;
			var camDeadzoneWidth = Math.floor((gameConfig.gameWidth*3)/4 - this.player.width/2);
			this.game.camera.deadzone = new Phaser.Rectangle(0, 0, camDeadzoneWidth, gameConfig.gameHeight);
		};
		Game.prototype.update = function(){
			this.player.update();
			this.abbo.update();
			this.enemy.update();
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
	        //this.game.debug.context.fillRect(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height);
			//this.game.debug.spriteBounds(this.player);
			
			//this.game.debug.spriteInfo(this.player, 32, 32);
			//this.game.debug.spriteCoords(this.player, 32, 128);
			
			//this.game.debug.

	        this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
    	};
    	Game.prototype.quitGame = function(pointer){
    		this.state.start('MainMenu');
    	};
		return Game;
	})();
	GameState.Game = Game;
})(GameState || {});
