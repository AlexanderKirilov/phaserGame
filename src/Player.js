var Player = (function(){
	function Player(game, x, y){
		Phaser.Sprite.call(this, game, x, y,'billy_sheet');

		game.physics.arcade.enable(this);
		this.playerDeltaJumpVelocity = 200;
		this.playerDeltaVelocity = 85;
		// 0.001 * pxPerSecond;
		this.multiplier = 0.001 * this.playerDeltaJumpVelocity;
		//this.scale.setTo(1.1, 1.1);
		this.anchor.setTo(0.5,1);
		//define player's input keys
		this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.punchKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
		this.cursors = game.input.keyboard.createCursorKeys();
		
		//define player's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 3, '', 1), 3, true);
		//this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 0, 4, '', 1), 8, false);
		this.animations.add('walk', Phaser.Animation.generateFrameNames('walk_forward/', 0, 5, '', 1), 8, true);
		this.animations.add('run', Phaser.Animation.generateFrameNames('run/', 0, 5, '', 1), 8, true);
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punch_left/', 0, 4, '', 1), 6, false);
		this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punch_right/', 0, 4, '', 1), 8, false);

		//Define player's states
		var self = this;
		this.stateMachine = new StateMachine(this, {debug:true});
		this.stateMachine.add('idle', {
			enter: function(){
				self.body.velocity.setTo(0,0);
			},
			update: function(){
				//self.body.setSize(self.width, self.height);
				//self.body.reset(self.x,self.y);
			},
			exit: function(){
			}
		});
		this.stateMachine.add('jump', {
			enter: function(){
				//keep player initial coordinate for reference
				this.startY = self.y;
				this.time = new Date().getTime();
				self.body.velocity.y = 0;
			},
			update: function(){
				var now = new Date().getTime();
				var delta = now - (this.time||now);
				var step = 0.1;
				//catch up with physics time
				//match the physical bounding box
				
				if(now - self.stateMachine.timer < 400){
					self.y -= self.multiplier * delta;
					self.y += step;
					self.frameName = 'jump/0';
				}else{
					if(self.y < this.startY){
						self.y += self.multiplier * delta;
						self.y -= step;
					}else{
						self.body.velocity.y = 0;
						self.stateMachine.doTransition('idle'); //force transition
						self.y = this.startY;
					}
				}
				this.time = now;
			},
			exit: function(){
			}
		}, ' ');
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
				self.body.setSize(self.width/2, self.height, self.width/2*self.scale.x, 0);
				self.body.reset(self.x,self.y);
			},
			exit: function(){
			}
		});
		this.stateMachine.add('walk', {
			enter: function(){
				var initialKeyDownTime;
				var leftCursor = self.cursors.left;
				var rightCursor = self.cursors.right;
				var rightLastPressed;
				var leftLastPressed;
				debugger;
				if((rightCursor.isDown)){
					initialKeyDownTime = rightCursor.timeDown;
				}
				if(leftCursor.isDown){
					initialKeyDownTime = leftCursor.timeDown;
				}
				if(initialKeyDownTime !== undefined){
					if(initialKeyDownTime - (this.lastPress || 0) < 250){
						self.stateMachine.doTransition('run');
					}
					this.lastPress = initialKeyDownTime;
				}
			},
			update: function(){
				self.body.velocity.setTo(0,0);
				if(self.cursors.right.isDown){
					self.scale.x = 1;
					self.body.velocity.x = self.playerDeltaVelocity;
					self.body.setSize(self.width, self.height);
				}
				if(self.cursors.left.isDown){
					self.scale.x = -1;
					self.body.velocity.x = -self.playerDeltaVelocity;
					self.body.setSize(self.width*self.scale.x, self.height);
				}
				if(self.cursors.up.isDown){
					if(self.body.bottom <= 200){
						self.body.y = 150 - self.body.width;
					}else{
						self.body.velocity.y = -self.playerDeltaVelocity;
					}
				}
				if(self.cursors.down.isDown){
					if(self.body.bottom + 4 <= self.game.world.bottom){
						self.body.velocity.y = self.playerDeltaVelocity;
					}
				}
			},
			exit: function(){
				//  Reset the players velocity (movement)
			}
		});
		this.stateMachine.add('run', {
			enter: function(){
			},
			update: function(){
								if(self.cursors.left.isDown){
					self.body.velocity.x = -(2*self.playerDeltaVelocity);
				}else if(self.cursors.right.isDown){
					self.body.velocity.x = 2*self.playerDeltaVelocity;
				}
			},
			exit: function(){
			}
		})
		//define player's transitions between states
		this.stateMachine.transition('', 'idle', 'walk', function(){
			return (self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown);
		});	
		this.stateMachine.transition('', 'walk', 'idle', function(){
			return(!(self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown));
		});
		this.stateMachine.transition('', 'idle', 'jump', function(){
			return (self.jumpKey.downDuration(20));
		});
		//jump -> idle is done manually
		this.stateMachine.transition('', 'run', 'idle', function(){
			return(!(self.cursors.left.isDown || self.cursors.right.isDown));
		});
		//walk/idle -> run is done manually
		this.stateMachine.transition('', 'walk', 'punchLeft', function(){
			return(self.punchKey.downDuration(200));
		});
		this.stateMachine.transition('', 'walk', 'jump', function(){
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