var EnemyFrank = (function(){
	function EnemyFrank (gameState, x, y, spriteSheet) {
		this.game = gameState.game;
		Phaser.Sprite.call(this, this.game, x, y, spriteSheet || 'frank_sheet');

		this.health = 4; // keep count of entitiies health	
	
		this.game.physics.arcade.enable(this);
		this.scale.x = -1;
		this.anchor.setTo(0.5, 1);
		
		this.entityDeltaVelocity = 55;
		//keep player reference
		this.player = gameState.player;
		this.idle = false;

		this.closestHitRange = 65;
		//define Enemy's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 3, '', 1), 3, true);
		this.animations.add('walkTowards', Phaser.Animation.generateFrameNames('walk/', 0, 5, '', 1), 8, true);

		this.animations.add('kick', Phaser.Animation.generateFrameNames('kick/', 0, 4, '', 1), 8, false);
		this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punch_right/', 0, 3, '', 1), 8, false);
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punch_left/', 0, 2, '', 1), 6, false);
		this.animations.add('smashHit', Phaser.Animation.generateFrameNames('smash_hit/', 0, 2, '', 1), 6, false);

		this.animations.add('fall', ['fall/0'], 0, false);
		this.animations.add('knocked', Phaser.Animation.generateFrameNames('knocked/', 0, 1, '', 1), 10, false);
		this.animations.add('stunned', Phaser.Animation.generateFrameNames('stunned/', 0, 1, '', 1), 10, false);
		this.animations.add('knockdown', Phaser.Animation.generateFrameNames('knockdown/', 1, 3, '', 1), 6,false);
		this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 0, 2, '', 1), 3, false);
		
		this.animations.add('landTrans', Phaser.Animation.generateFrameNames('land_trans/', 0, 1, '', 1), 2, false);

		this.playerDistanceX;
		this.playerDistanceY;
		var self = this;
		this.stateMachine = new StateMachine(this , {debug:true});
		this.stateMachine.add('idle', {
			enter: function(){
				self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x,self.y);
				if(self.idle === true){
					this.idleTimer = new Date().getTime();
				}
			},
			update: function(){
				if(new Date().getTime() - this.idleTimer > 800){
					self.idle = false;
				}
			},
			exit: function(){
				this.idleTimer = 0;
			}
		});
		this.stateMachine.add('walkTowards', {
			enter: function(){
				self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x,self.y);
			},
			update: function(){
				if(self.playerDistanceX < 0 && self.scale.x > 0){
					self.scale.x *= -1
				}else if(self.playerDistanceX > 0 && self.scale.x < 0){
					self.scale.x *= -1;
				}
				var absPlayerDistanceX = Math.abs(self.playerDistanceX);
				var absPlayerDistanceY = Math.abs(self.playerDistanceY);
				if(absPlayerDistanceY > 8){
					self.body.velocity.y = (self.playerDistanceY/absPlayerDistanceY)*self.entityDeltaVelocity/2;
					if(self.y < 180){
						self.y = 180;
					}else if(self.y > gameConfig.height){
						self.y = gameConfig.height;
					}
				}else if(absPlayerDistanceX >= self.closestHitRange){					
					self.body.velocity.x = (self.playerDistanceX/absPlayerDistanceX)*self.entityDeltaVelocity;
				}else{
					self.stateMachine.doTransition('idle');
				}
			},
			exit: function(){
				self.body.velocity.setTo(0,0);
			}
		});
		this.stateMachine.add('punchRight', {
			hitBox:1,
			enter: function(){
				this.playerHit = false;
			},
			update: function(){
				self.body.setSize(self.width*2/3, self.height, self.width/3*self.scale.x, 0);
				self.body.reset(self.x,self.y);
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					var currState = this; // refference hell keep track for V
					self.game.physics.arcade.collide(self, self.player, function(enemy, player){ // do...
						player.registerHit(enemy.scale.x);
						currState.playerHit = true;
						self.idle = true;
					}, function(enemy, player){ // if overlap
						return !currState.playerHit;
					});
				}
			},
			exit: function(){
				this.playerHit = false
			}
		});
		this.stateMachine.add('punchLeft', {
			hitBox:0,
			enter: function(){
				this.playerHit = false;
			},
			update: function(){
				self.body.setSize(self.width*2/3, self.height, self.width/3*self.scale.x, 0);
				self.body.reset(self.x,self.y);
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					var currState = this; // refference hell keep track for V
					self.game.physics.arcade.collide(self, self.player, function(enemy, player){ // do...
						player.registerHit(enemy.scale.x);
						currState.playerHit = true;
						self.idle = true;
					}, function(enemy, player){ // if overlap 
						return !currState.playerHit;
					});
				}
			},
			exit: function(){
				this.playerHit = false
			}
		});
		this.stateMachine.add('fall', {
			enter: function(){
				self.animations.stop(null, true);

				self.body.velocity.y = 250;
				self.frameName = 'fall/0';
			},
			update: function(){
				if(self.y > self.player.y){
					self.stateMachine.doTransition('idle', 'landTrans');
				}
			},
			exit: function(){
				self.body.gravity.y = 0;
			}
		});
		this.stateMachine.add('knockdown', {
			enter: function(){
				self.animations.stop(null, true);
				self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x,self.y);
				this.playerStartVelocityX = self.player.body.velocity.x*1/4; 
				self.body.velocity.x = this.playerStartVelocityX;

				this.startY = self.y;
				self.body.velocity.y -= 150;
				self.body.gravity.y = 120;

				this.bounce = false;

			},
			update: function(){
				if(this.endTimer){
					if(new Date().getTime() - this.endTimer > 1000 && self.y >= this.startY){
						self.stateMachine.doTransition('idle');
					}
					return;
				}
				if(self.y <= this.startY && !this.bounce){
				}else if(!this.bounce){
					self.y = this.startY;
					this.bounce = true;
					self.animations.next();
					self.body.reset(self.x,self.y);
					self.body.velocity.y -= 35;
					self.body.gravity.y = 80;
					self.body.velocity.x = this.playerStartVelocityX/2;
					self.game.camera.shake(0.005, 300);
				}else{
					self.y = this.startY;
					self.animations.next();
					this.endTimer = new Date().getTime();
				}
			},
			exit: function(){
				this.bounce = false;
				self.body.gravity.y = 0;

				this.endTimer = 0;
			}
		});
		this.stateMachine.add('knocked', {
			enter: function(){
				this.idle = false;

				self.body.setSize(self.width*self.scale.x, self.height);
				self.body.reset(self.x,self.y);
				self.body.velocity.x = -self.scale.x*22;
			},
			update: function(){
				self.body.velocity.x -= self.body.velocity.x/50;
			},
			exit: function(){
				self.body.velocity.x = 0;
			},
		});
		this.stateMachine.add('stunned', {
			enter: function(){},
			update: function(){},
			exit: function(){},
		});
		this.stateMachine.add('die',{
			enter: function(){
				self.body.enable = false;
			},
			update: function(){
				var startTimeDelta = new Date().getTime() - self.stateMachine.timer;
				if(startTimeDelta > 2500){
					self.kill();
				}
			},
			exit: function(){}
		});
		this.stateMachine.transition('', 'idle', 'walkTowards', function(){
			return(Math.abs(self.playerDistanceX) > self.closestHitRange || Math.abs(self.playerDistanceY) > 8);
		});
		this.stateMachine.transition('', 'idle', 'punchLeft', function(){
			return(Math.abs(self.playerDistanceX) <= self.closestHitRange  && Math.abs(self.playerDistanceY) <= 8 
				&& self.idle === false  && self.player.stateMachine.currentState != 'knocked');
		});
		this.stateMachine.transition('', 'punchLeft', 'punchRight', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.stateMachine.transition('', 'punchRight', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.stateMachine.transition('', 'knocked', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying && (new Date().getTime() -self.stateMachine.timer.getTime() > 1000));
		});
		this.stateMachine.transition('', 'stunned', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying && (new Date().getTime() - self.stateMachine.timer.getTime() > 1500));
		});
	}
	EnemyFrank.prototype = Object.create(Phaser.Sprite.prototype)
	EnemyFrank.prototype.constructor = EnemyFrank;
	
	EnemyFrank.prototype.update = function(){
		if(!this.health){
			this.stateMachine.doTransition('die')
		}
		this.playerDistanceX = this.player.x - this.x;
		this.playerDistanceY = this.player.y - this.y;

		
		this.stateMachine.update();

	};
	EnemyFrank.prototype.registerHit = function(direction, punchStateType){
		//face the hitting enemy
		if(direction){
			this.scale.x = -direction;
		}
		switch(punchStateType){
			case 'runPunch':
				this.stateMachine.doTransition('knockdown');
				break;
			default:
				this.stateMachine.doTransition('knocked');
		}
		if(!this.health){
			return
		}
		this.health--;
		if(this.stateMachine.previousState === 'knocked'){
			this.stateMachine.doTransition('stunned');
		}
	};
	return EnemyFrank;
})();