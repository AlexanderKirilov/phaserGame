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

		    this.rootGroup;
		    this.StageMachine;
		    this.enemiesGroup;  // an array representing the current active (engaged) enemys;


		}
		Game.prototype.create = function(){
	        this.game.debug.context.fillStyle = 'rgba(255,0,0,0.6)';
			//disable smoothing for pixel art
			this.game.stage.smoothed = false;
			this.game.renderer.renderSession.roundPixels = true;

			this.levelBackgroundGroup = this.game.add.group(undefined, 'levelBackgroundGroup', false);
			this.rootGroup = new RenderGroup(this.game, undefined, 'rootDisplayGroup', false);
			//set the stage to
			//initiate world
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
			this.game.time.advancedTiming = true;

			//add level background
			var levelBg = this.levelBackgroundGroup.create(0, 0, 'bg');
			this.game.world.setBounds(0, 0, levelBg.width, levelBg.height);
			
			/* Background level animations */
			// fire animation (560, 120)
			this.levelBackgroundGroup.add(new Fire (this.game, 560, 120));
			//Left gang animation
			var leftGang = this.levelBackgroundGroup.create(490, 86, 'left_gang');
			leftGang.animations.add('stay');
			leftGang.animations.play('stay', 2, true);
			//
			//Right gang animation
			var rightGang =	this.levelBackgroundGroup.create(591, 78, 'right_gang');
			rightGang.animations.add('stay');
			rightGang.animations.play('stay', 2, true);

			// create final  boss (Abbobo)
			//this.abbo = new Abbo(this.game, 1300, 200);

			//create player
			this.player = new Player(this, 40, 180);
			this.rootGroup.add(this.player);
			
			//set the camera follow to be more beat em up style;
			var camDeadzoneWidth = Math.floor((gameConfig.gameWidth*3)/4 - this.player.width/2);
			this.game.camera.deadzone = new Phaser.Rectangle(0, 0, camDeadzoneWidth, gameConfig.gameHeight);

			//the enemiesGroup PARENT group that the level's stages are gona use to spawn enemies and check collision shared for the player's collision
			//currently flushed on stage advance
			this.enemiesGroup = this.game.add.group(this.rootGroup, 'simpleEnemyGroup', false);

			this.StageMachine = new StageMachine(this);
			var self = this;
			this.StageMachine.add({
				boundRight: 400,
				enter:function(){
					//self.enemiesGroup.add(new Enemy(self, 150, 200));
					self.enemiesGroup.add(new EnemyFrank(self, 160, 230));
				},
				update:function(){
					self.enemiesGroup.forEachExists(function(enemy){
						enemy.update();
					}, this);
				},
				exit:function(){
					self.enemiesGroup.removeAll();
				}
			});
			this.StageMachine.start();

			//DEBUG ONLY
			window.body = this.player.body;
			window.player = this.player;
		    window.game = this.game;
		    window.state = this;
		};
		Game.prototype.update = function(){
			this.player.update();
			//update stage
			this.StageMachine.update();
			//this.abbo.update();
			
			this.rootGroup.sort('y');

			this.cleanUp(); // handle proper sprite cleanUp on .kill() http://davidp.net/phaser-sprite-destroy/
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
	        /*this.enemiesGroup.forEachAlive(function(enemy){
	        	this.game.debug.context.fillRect(enemy.body.x, enemy.body.y, enemy.body.width, enemy.body.height);
	        }, this);
	        *///this.game.debug.context.fillRect(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height);
			//this.game.debug.spriteBounds(this.player);
			
			//this.game.debug.spriteInfo(this.player, 32, 32);
			//this.game.debug.spriteCoords(this.player, 32, 128);
			
			//this.game.debug.

	        this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
    	};
    	Game.prototype.quitGame = function(pointer){
    		this.state.start('MainMenu');
    	};
    	Game.prototype.cleanUp = function(){
			var aCleanup = [];
			this.enemiesGroup.forEachDead(function(item){
			    aCleanup.push(item);
			});

			var i = aCleanup.length - 1;
			while(i > -1)
			{
			    var getitem = aCleanup[i];
			    getitem.destroy();
			    i--;
			}
		}
		return Game;
	})();
	GameState.Game = Game;
})(GameState || {});
