 var Player = (function(){
	function Player(state, x, y, spriteSheet){
		Phaser.Sprite.call(this, state.game, x, y, spriteSheet || 'billy_sheet');
		this.state = state;

		this.game.physics.arcade.enable(this);
		this.playerDeltaJumpVelocity = 280;
		this.playerDeltaVelocity = 85;

		// 0.001 * pxPerSecond;
		//this.multiplier = 0.001 * this.playerDeltaJumpVelocity;
		//this.scale.setTo(1.1, 1.1);
		this.anchor.setTo(0.5,1);
		//define player's input keys
		this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.punchKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		//define player's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 3, '', 1), 3, true);
		//this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 0, 4, '', 1), 8, false);
		this.animations.add('walk', Phaser.Animation.generateFrameNames('walk_forward/', 0, 5, '', 1), 8, true);
		this.animations.add('run', Phaser.Animation.generateFrameNames('run/', 0, 5, '', 1), 8, true);
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punch_left/', 1, 5, '', 1), 7, false);
		this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punch_right/', 1, 5, '', 1), 7, false);
		this.animations.add('runPunch', Phaser.Animation.generateFrameNames('run_punch/', 0, 3, '', 1), 7, false);
		this.animations.add('landTrans', Phaser.Animation.generateFrameNames('land_trans/', 0, 1, '', 1), 6, false);

		//Define player's states
		var self = this;
		this.stateMachine = new StateMachine(this, {debug:true});
		this.stateMachine.add('idle', {
			enter: function(){
				self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x,self.y);
			},
			update: function(){},
			exit: function(){}
		});
		this.stateMachine.add('punchLeft', {
			movementBreakpointFrameId:1,
			punchBreakpointFrameId:3,
			hitBox:1,
			enter: function(){
				self.punchKey.reset(false);

				this.nextPunch = false;
			},
			handleInput: function(){
				if(self.punchKey._justDown){
					this.nextPunch = true;
					self.punchKey.reset(false);
				}
				if(self.animations.currentAnim._frameIndex >= this.punchBreakpointFrameId && this.nextPunch){
					self.stateMachine.doTransition('punchRight');
				}
				if(self.animations.currentAnim._frameIndex >= this.movementBreakpointFrameId){
					if(self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown){
						self.stateMachine.doTransition('walk');
					}
				}
			},
			update: function(){
				self.body.setSize(self.width/2, self.height, self.width/2*self.scale.x, 0);
				self.body.reset(self.x,self.y);
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					self.game.physics.arcade.overlap(self, self.state.enemiesGroup, function(player, enemyFromGroup){ // do...
						enemyFromGroup.registerHit();
					}, function(player, enemyFromGroup){ // if overlap AND close on Y axis
						return (self.bottom > enemyFromGroup.bottom-10 && self.bottom < enemyFromGroup.bottom+10);
					});
				}
			},
			exit: function(){}
		});
		this.stateMachine.add('punchRight', {
			movementBreakpointFrameId:1,
			punchBreakpointFrameId:3,
			hitBox:1,
			enter: function(){
				self.punchKey.reset(false);

				this.nextPunch = false;
			},
			handleInput: function(){
				if(self.punchKey._justDown){
					this.nextPunch = true;
					self.punchKey.reset(false);
				}
				if(self.animations.currentAnim._frameIndex >= this.punchBreakpointFrameId && this.nextPunch){
					self.stateMachine.doTransition('punchLeft');
				}
				if(self.animations.currentAnim._frameIndex >= this.movementBreakpointFrameId){
					if(self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown){
						self.stateMachine.doTransition('walk');
					}
				}
			},
			update: function(){
				self.body.setSize(self.width/2, self.height, self.width/2*self.scale.x, 0);
				self.body.reset(self.x,self.y);
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					self.game.physics.arcade.overlap(self, self.state.enemiesGroup, function(player, enemyFromGroup){ // do...
						console.log('hit');
					}, function(player, enemyFromGroup){ // if overlap AND close on Y axis
						return (self.bottom > enemyFromGroup.bottom-10 && self.bottom < enemyFromGroup.bottom+10);
					});
				}
			},
			exit: function(){}
		});
		this.stateMachine.add('runPunch', {
			hitBox:0,
			enter: function(){},
			update: function(){
				self.body.velocity.x -= 3*self.scale.x;
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					self.game.physics.arcade.overlap(self, self.state.enemieGroup, function(player, enemyFromGroup){ // do...
						console.log('hit');
					}, function(player, enemyFromGroup){ // if overlap AND close on Y axis
						return (self.bottom > enemyFromGroup.bottom-10 && self.bottom < enemyFromGroup.bottom+10);
					});
				}
			},
			exit: function(){}
		});
		this.stateMachine.add('jump', {
			enter: function(){
				//keep player initial coordinate for reference
				this.startY = self.y;
				this.time = self.game.time.time;
				self.body.velocity.y = -self.playerDeltaJumpVelocity;
				//hack for transition condition
				self.y--;
				self.body.gravity.y = 530;
			},
			update: function(){
				//for frame reference
				var currJumpHeight = this.startY - self.y;
				if(currJumpHeight > 55){
					self.frameName = 'jump/2';
				}else if(currJumpHeight > 30){
					self.frameName = 'jump/1';
				}else{
					self.frameName = 'jump/0';
				}
				if(self.y >= this.startY){
					self.y = this.startY;
					self.stateMachine.doTransition('idle', 'landTrans'); //force transition
				}
			},
			exit: function(){
				self.body.velocity.y = 0;
				self.body.gravity.y = 0;
			}
		});
		this.stateMachine.add('walk', {
			enter: function(){
				self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x,self.y);
				var initialKeyDownTime;
				var leftCursor = self.cursors.left;
				var rightCursor = self.cursors.right;
				var rightLastPressed;
				var leftLastPressed;
				if((rightCursor.downDuration(20))){
					initialKeyDownTime = rightCursor.timeDown;
				}
				if(leftCursor.downDuration(20)){
					initialKeyDownTime = leftCursor.timeDown;
				}
				if(initialKeyDownTime !== undefined){
					if(initialKeyDownTime - (this.lastPress || 0) < 250){
						self.stateMachine.doTransition('run');
						return;
					}
					this.lastPress = initialKeyDownTime;
				}
			},
			update: function(){
				self.body.velocity.setTo(0,0);
				if(self.cursors.right.isDown && (self.right<self.game.camera.bounds.width)){
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
					if(self.body.y <= 105){
						self.body.y = 105;
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
			exit: function(){}
		});
		this.stateMachine.add('run', {
			enter: function(){
				//self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x, self.y);
				if(self.cursors.left.isDown){
					self.body.velocity.x = -(2*self.playerDeltaVelocity);
				}else if(self.cursors.right.isDown){
					self.body.velocity.x = 2*self.playerDeltaVelocity;
				}
			},
			update: function(){
				if(self.right>self.game.camera.bounds.width){
					self.body.velocity.x = 0;
				}
			},
			exit: function(){
			}
		})
		//define player's transitions between states
		this.stateMachine.transition('', 'idle', 'walk', function(){
			return (self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown);
		});	
		this.stateMachine.transition('', 'idle', 'punchLeft', function(){
			return(self.punchKey.downDuration(30));
		});
		this.stateMachine.transition('', 'idle', 'jump', function(){
			return(self.jumpKey.downDuration(20));
		});
		//jump -> idle is done manually
		this.stateMachine.transition('', 'run', 'idle', function(){
			return(!(self.cursors.left.isDown || self.cursors.right.isDown));
		});
		this.stateMachine.transition('', 'run', 'jump', function(){
			return(self.jumpKey.downDuration(30));
		});
		this.stateMachine.transition('', 'run', 'runPunch', function(){
			return(self.punchKey.downDuration(30));
		});
		//walk/idle -> run is done manually
		this.stateMachine.transition('', 'walk', 'idle', function(){
			return(!(self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown));
		});
		this.stateMachine.transition('', 'walk', 'punchLeft', function(){
			return(self.punchKey.downDuration(30));
		});
		this.stateMachine.transition('', 'walk', 'jump', function(){
			return(self.jumpKey.downDuration(20));
		});
		this.stateMachine.transition('', 'runPunch', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.stateMachine.transition('', 'punchLeft', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.stateMachine.transition('', 'punchRight', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.animations.play(this.stateMachine.initialState);

		//limit player
		this.body.collideWorldBounds = true;
		
		this.game.add.existing(this);

		//set camera to follow player;
		this.game.camera.follow(this);
	}
	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		this.stateMachine.update();
	};
	return Player;
})();