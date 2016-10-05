var Player = (function(){
	function Player(game, x, y){
		Phaser.Sprite.call(this, game, x, y,'billy_sheet');

		game.physics.arcade.enable(this);
		this.playerDeltaJumpVelocity = 150;
		this.playerDeltaVelocity = 85;
		//this.scale.setTo(1.1, 1.1);
		this.anchor.setTo(0,1);
		//define player's input keys
		
		this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.punchKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
		this.cursors = game.input.keyboard.createCursorKeys();
		
		//define player's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 3, '', 1), 3, true);
		this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 0, 2, '', 1), 4, false);
		this.animations.add('walkForward', Phaser.Animation.generateFrameNames('walk_forward/', 0, 5, '', 1), 8, true);
		this.animations.add('walkBackward', Phaser.Animation.generateFrameNames('walk_backward/', 0, 5, '', 1), 8, true);
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punch_left/', 0, 5, '', 1), 8, false);
		this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punch_right/', 0, 4, '', 1), 8, false);

		//Define player's states
		var self = this;
		this.stateMachine = new StateMachine(this, {debug:true});
		this.stateMachine.add('idle', {
			enter: function(){
				self.body.velocity.setTo(0,0);
			},
			update: function(){
				self.body.height = self.height;	
			},
			exit: function(){}
		});
		this.stateMachine.add('jump', {
			enter: function(){
				this.startY = self.y;
			},
			update: function(){
				if(self.height !== self.body.height){
					self.body.height = self.height;
				}
				if(new Date() - self.stateMachine.timer < 450){
					self.body.velocity.y = -self.playerDeltaJumpVelocity;
				}else{
					if(self.y < this.startY){
						self.body.velocity.y = self.playerDeltaJumpVelocity;
					}else{
						self.body.velocity.y = 0;
						self.stateMachine.doTransition('idle'); //force transition
						self.y = this.startY-2;
					}
				}
			},
			exit: function(){
			}
		});
		this.stateMachine.add('punchRight', {
			enter: function(){},
			update: function(){},
			exit: function(){}
		});	
		this.stateMachine.add('punchLeft', {
			enter: function(){
				self.body.velocity.setTo(0,0);
			},
			update: function(){
			},
			exit: function(){}
		});
		this.stateMachine.add('walkForward', {
			enter: function(){},
			update: function(){
				self.body.velocity.y = 0;
				if(self.cursors.right.isDown){
					this.animationName = 'walkForward';
					self.body.velocity.x = self.playerDeltaVelocity;
				}
				if(self.cursors.left.isDown){
					this.animationName = 'walkBackward';
					self.body.velocity.x = -self.playerDeltaVelocity;
				}
				if(self.cursors.up.isDown){
					if(self.body.y + self.body.width <= 150){
						self.body.y = 150 - self.body.width;
					}else{
						self.body.velocity.y = -self.playerDeltaVelocity;
					}
				}
				if(self.cursors.down.isDown){
					self.body.velocity.y = self.playerDeltaVelocity;
				}
			},
			exit: function(){
				//  Reset the players velocity (movement)
				
			}
		});
		//define player's transitions between states
		this.stateMachine.transition('', 'idle', 'walkForward', function(){
			return (self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown);
		});	
		this.stateMachine.transition('', 'walkForward', 'idle', function(){
			return(!(self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown));
		});
		this.stateMachine.transition('', 'idle', 'jump', function(){
			return (self.jumpKey.downDuration(20));
		});
		//jump -> idle is done manually
		this.stateMachine.transition('', 'walkForward', 'punchLeft', function(){
			return(self.punchKey.downDuration(200));
		});
		this.stateMachine.transition('', 'walkForward', 'jump', function(){
			return(self.jumpKey.downDuration(20));
		});
		this.stateMachine.transition('', 'idle', 'punchLeft', function(){
			return(self.punchKey.downDuration(200));
		});
		this.stateMachine.transition('', 'punchLeft', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.animations.play(this.stateMachine.initialState);

		//limit player
		this.body.collideWorldBounds = true;
		
		this.game.add.existing(this);

		//set camera to follow player;
		game.camera.follow(this);
		//DEBUG ONLY
		window.body = this.body;
		window.player = this;
	}
	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		this.stateMachine.update();
	};
	return Player;
})();