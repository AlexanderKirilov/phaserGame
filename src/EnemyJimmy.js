var EnemyJimmy = (function(){
    function EnemyJimmy (gameState, x, y, spriteSheet) {
    	this.game = gameState.game;
        Phaser.Sprite.call(this, this.game, x, y, spriteSheet || 'jimmy_sheet'); 

          this.health = 50;	
          this.game.physics.arcade.enable(this);
          this.body.collideWorldBounds = true;
          this.anchor.setTo(0.5, 1);
          this.hitAction = false;
          this.isAggro = false; //e.g. if a player is in range
          this.aggroRange = 100;
          this.hitRange = 50;
          this.uppercutRange = 20
          this.isEnemy = true;
          this.healthBarShape = null;
          this.jimmyDeltaVelocity = 50;
          this.anchor.setTo(0.5, 1);
          this.exist = true;
          this.alive = true;
         
          this.player = gameState.player;
       
         //define EnemyJimmy's animations
         this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 0, 3, '', 1), 4, false); //
         this.animations.add('highKick', Phaser.Animation.generateFrameNames('highKick/', 0, 3, '', 1), 6, false)
         this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 2, '', 1), 3, true);   //       
         this.animations.add('knocked', Phaser.Animation.generateFrameNames('knocked/', 0, 1, '', 1), 10, false); //
         this.animations.add('lowKick', Phaser.Animation.generateFrameNames('lowKick/', 0, 3, '', 1), 4, false);
         this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punchLeft/', 0, 4, '', 1), 10, false);
         this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punchRight/', 0, 3, '', 1), 10, false);
         this.animations.add('uppercut', Phaser.Animation.generateFrameNames('uppercut/', 0, 8, '', 1), 10, false);
         this.animations.add('walk', Phaser.Animation.generateFrameNames('walk/', 0, 5, '', 1), 8, true); //


         

       
         this.game.add.existing(this);
         
         this.distanceToPlayerX;
 		 this.distanceToPlayerY;
 		 var self = this;
 		 
 		 this.stateMachine = new StateMachine(this , {debug:true});
 		 this.stateMachine.add('walk', {
 			enter: function() {},
 			update: function() {
 				if (self.distanceToPlayerX < 0 && self.scale.x > 0) {
 					self.scale.x *= -1
 				} else if (self.distanceToPlayerX > 0 && self.scale.x < 0) {
 					self.scale.x *= -1;
 				}
 				var absdistanceToPlayerX = Math.abs(self.distanceToPlayerX);
 				var absdistanceToPlayerY = Math.abs(self.distanceToPlayerY);
 				
 				if (absdistanceToPlayerY >= 20) {
 					self.body.velocity.y = (self.distanceToPlayerY/Math.abs(self.distanceToPlayerY))*self.jimmyDeltaVelocity/2;
 					if (self.y < 180) {
 						self.y = 180;
 					} else if (self.y > gameConfig.height) {
 						self.y = gameConfig.height;
 					}
 				} else if (absdistanceToPlayerX >= self.hitRange) {					
 					self.body.velocity.x = (self.distanceToPlayerX/Math.abs(self.distanceToPlayerX))*self.jimmyDeltaVelocity;
 				}
 			},
 			exit: function() {
 				self.body.velocity.setTo(0,0);
 			}
 		});
 		this.stateMachine.add('punchLeft', {
			hitBox:1,
			enter: function(){
				this.playerHit = false;
			},
			update: function() {
				if(self.animations.currentAnim._frameIndex >= this.hitBox) {
					var currState = this;
					self.game.physics.arcade.collide(self, self.player, function(enemy, player){
						player.registerHit();
						currState.playerHit = true;
					}, function(enemy, player) {
						return (enemy.bottom > player.bottom - 10 && enemy.bottom < player.bottom + 10
							&& !currState.playerHit);
					});
				}
			},
			exit: function(){
				this.playerHit = false
			}
		});
 		this.stateMachine.add('punchRight', {
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
						return (enemy.bottom > player.bottom - 10 && enemy.bottom < player.bottom + 10
							&& !currState.playerHit);
					});
				}
			},
			exit: function(){
				this.playerHit = false
			}
		});
 		this.stateMachine.add('uppercut', {
 			hitBox:1,
			enter: function(){
				this.playerHit = false;
				self.body.velocity.x += self.scale.x*10;
			},
			update: function(){
				if(self.animations.currentAnim._frameIndex >= this.hitBox){
					var currState = this; // refference hell keep track for V
					self.game.physics.arcade.collide(self, self.player, function(enemy, player){ // do...
						player.registerHit();
						currState.playerHit = true;
					}, function(enemy, player){ // if overlap AND close on Y axis
						return (enemy.bottom > player.bottom - 10 && enemy.bottom < player.bottom + 10
							&& !currState.playerHit);
					});
				}
			},
			exit: function(){
				this.playerHit = false;
				this.kickAvailable = true;
			}
		});
 		this.stateMachine.add('highKick', {
 			hitBox:1,
			enter: function(){
				this.playerHit = true;
				self.body.velocity.x = self.scale.x*5;
			},
			update: function(){
				if(this.health <= 40) {
					if(self.animations.currentAnim._frameIndex >= this.hitBox){
						var currState = this; // refference hell keep track for V
						self.game.physics.arcade.collide(self, self.player, function(enemy, player){ // do...
							player.registerHit();
							currState.playerHit = true;
						}, function(enemy, player){ // if overlap AND close on Y axis
							return (enemy.bottom > player.bottom - 10 && enemy.bottom < player.bottom + 10
								&& !currState.playerHit);
						});
					}
				}
			},
			exit: function(){
				this.playerHit = false;
			},
		});
 		this.stateMachine.add('knocked', {
			enter: function(){
				self.body.velocity.x = -self.scale.x*10;
			},
			update: function(){
				self.body.velocity.x -= self.body.velocity.x;
			},
			exit: function(){
				self.body.velocity.x = 0;
			},
		});
 		this.stateMachine.add('die',{
			enter: function(){
				self.body.enable = false;
			},
			update: function(){
				var startTimeDelta = new Date().getTime() - self.stateMachine.timer;
				if (startTimeDelta > 2000){
					self.kill();
				}
			},
			exit: function(){}
		});
 		
 		//transitions
 		this.stateMachine.transition('', 'walk', 'punchLeft', function(){
			return(Math.abs(self.distanceToPlayerX) <= self.hitRange && Math.abs(self.distanceToPlayerY) <= 10 );
		});
 		this.stateMachine.transition('', 'punchLeft', 'punchRight', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
 		this.stateMachine.transition('', 'punchRight', 'uppercut', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
 		this.stateMachine.transition('', 'uppercut', 'walk', function(){
			return(!self.animations.currentAnim.isPlaying); 
		}); 
 		this.stateMachine.transition('', 'walk', 'knocked', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
 		this.stateMachine.transition('', 'walk', 'highKick', function(){
			return(Math.abs(self.distanceToPlayerX) <= self.hitRange && Math.abs(self.distanceToPlayerY) <= 10 );
 		});
 		this.stateMachine.transition('', 'highKick', 'walk', function(){
			return(!self.animations.currentAnim.isPlaying); 
		});
 		this.stateMachine.transition('', 'knocked', 'walk', function(){
			return(!self.animations.currentAnim.isPlaying && (new Date().getTime() - self.stateMachine.timer.getTime() > 1000));
		});
         
       
    }
    EnemyJimmy.prototype = Object.create(Phaser.Sprite.prototype);
    EnemyJimmy.prototype.constructor = EnemyJimmy;
    
    
    EnemyJimmy.prototype.registerHit = function(){
    	if(!this.health){
			return
		}
		this.health--;
		if (this.stateMachine.currentState == 'knocked') {
		} else {
			this.stateMachine.doTransition('knocked');
		}
	};
  
    EnemyJimmy.prototype.update = function() { 
    	if(!this.health) {
			this.stateMachine.doTransition('die')
		}
        
    	this.distanceToPlayerX = this.player.x - this.x;
		this.distanceToPlayerY = this.player.y - this.y;
   
		if((Math.abs(this.distanceToPlayerX) > 5 && Math.abs(this.distanceToPlayerY > 5)) || 
				(Math.abs(this.distanceToPlayerX) < 5 && Math.abs(this.distanceToPlayerY < 5))) {
			this.stateMachine.doTransition('walk');
		}
      
        this.stateMachine.update();

    }
   
    return EnemyJimmy;
})();