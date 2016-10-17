var EnemyFrank = (function(){
	function EnemyFrank (gameState, x, y, spriteSheet) {
		this.game = gameState.game;
		Phaser.Sprite.call(this, this.game, x, y, spriteSheet || 'frank_sheet');

		this.health = 7; // keep count of entitiies health	
	
		this.game.physics.arcade.enable(this);
		this.scale.x = -1;
		this.anchor.setTo(0.5, 1);
		
		this.entityDeltaVelocity = 55;
		//keep player reference
		this.player = gameState.player;

		this.closestHitRange = 65;
		//define Enemy's animations
		//this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 2, '', 1), 3, true);
		this.animations.add('walkTowards', Phaser.Animation.generateFrameNames('walk/', 0, 5, '', 1), 8, true);
		this.animations.add('kick', Phaser.Animation.generateFrameNames('kick/', 0, 4, '', 1), 8, false);
		this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punch_right/', 0, 3, '', 1), 8, false);
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punch_left/', 0, 2, '', 1), 6, false);
		this.animations.add('knocked', Phaser.Animation.generateFrameNames('knocked/', 0, 1, '', 1), 10, false);
		this.animations.add('stunned', Phaser.Animation.generateFrameNames('stunned/', 0, 1, '', 1), 10, false);
		this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 0, 2, '', 1), 10, false);
		
		this.playerDistanceX;
		this.playerDistanceY;
		var self = this;
		this.stateMachine = new StateMachine(this , {debug:true});
		this.stateMachine.add('walkTowards', {
			enter: function(){},
			update: function(){
				if(self.playerDistanceX < 0 && self.scale.x > 0){
					self.scale.x *= -1
				}else if(self.playerDistanceX > 0 && self.scale.x < 0){
					self.scale.x *= -1;
				}
				var absPlayerDistanceX = Math.abs(self.playerDistanceX);
				var absPlayerDistanceY = Math.abs(self.playerDistanceY);
				if(absPlayerDistanceY >= 10){
					self.body.velocity.y = (self.playerDistanceY/Math.abs(self.playerDistanceY))*self.entityDeltaVelocity/2;
					if(self.y < 180){
						self.y = 180;
					}else if(self.y > gameConfig.height){
						self.y = gameConfig.height;
					}
				}else if(absPlayerDistanceX >= self.closestHitRange){					
					self.body.velocity.x = (self.playerDistanceX/Math.abs(self.playerDistanceX))*self.entityDeltaVelocity;
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
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					var currState = this; // refference hell keep track for V
					self.game.physics.arcade.collide(self, self.player, function(enemy, player){ // do...
						player.registerHit();
						currState.playerHit = true;
					}, function(enemy, player){ // if overlap AND close on Y axis
						return (enemy.bottom > player.bottom-10 && enemy.bottom < player.bottom+10
							&& !currState.playerHit);
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
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					var currState = this; // refference hell keep track for V
					self.game.physics.arcade.collide(self, self.player, function(enemy, player){ // do...
						player.registerHit();
						currState.playerHit = true;
					}, function(enemy, player){ // if overlap AND close on Y axis
						return (enemy.bottom > player.bottom-10 && enemy.bottom < player.bottom+10
							&& !currState.playerHit);
					});
				}
			},
			exit: function(){
				this.playerHit = false
			}
		});
		this.stateMachine.add('knocked', {
			enter: function(){
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
			enter: function(){},
			update: function(){
				var startTimeDelta = new Date().getTime() - self.stateMachine.timer;
				if(startTimeDelta > 2000){
					self.kill();
				}
			},
			exit: function(){}
		});
		this.stateMachine.transition('', 'walkTowards', 'punchLeft', function(){
			return(Math.abs(self.playerDistanceX) <= self.closestHitRange  && Math.abs(self.playerDistanceY) <= 8 );
		});
		this.stateMachine.transition('', 'punchLeft', 'punchRight', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.stateMachine.transition('', 'punchRight', 'walkTowards', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.stateMachine.transition('', 'knocked', 'walkTowards', function(){
			return(!self.animations.currentAnim.isPlaying && (new Date().getTime() -self.stateMachine.timer.getTime() > 1000));
		});
		this.stateMachine.transition('', 'stunned', 'walkTowards', function(){
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
	EnemyFrank.prototype.registerHit = function(){
		if(!this.health){
			return
		}
		this.health--;
		if(this.stateMachine.currentState == 'knocked'){
			this.stateMachine.doTransition('stunned');
		}else{
			this.stateMachine.doTransition('knocked');
		}
	};
	return EnemyFrank;
})();