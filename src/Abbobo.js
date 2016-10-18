var Abbobo = (function(){
    function Abbobo (gameState, x, y, spriteSheet) {
    	this.game = gameState.game;
        Phaser.Sprite.call(this, this.game, x, y, spriteSheet || 'abbo_sheet'); 
       
          this.parentCreate();
 
          this.maxHealth = 100;
          this.game.physics.arcade.enable(this);
          this.body.collideWorldBounds = true;
          this.anchor.setTo(0.5, 1);
          this.hitAction = false;
          this.isAggro = false; //e.g. if a player is in range
          this.aggroRange = 100;
          this.hitRange = 50;
          this.isEnemy = true;
          this.healthBarShape = null;
          this.abboDeltaVelocity = 50;
          this.anchor.setTo(0.5, 1);
          this.damage = 0.5;
          this.exist = true;
          this.alive = true;
         
          this.player = gameState.player;
       
         //define Abbobo's animations
         this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 1, '', 1), 2, true);
         this.animations.add('walk', Phaser.Animation.generateFrameNames('walk/', 0, 4, '', 1), 8, true);
         this.animations.add('hit', Phaser.Animation.generateFrameNames('hit/', 0, 1, '', 1), 2, false);
         this.animations.add('gethit', Phaser.Animation.generateFrameNames('getHit/', 0, 3, '', 1), 4, false);
         this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 0, 0, '', 1), 1, false);
       
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
 					self.body.velocity.y = (self.distanceToPlayerY/Math.abs(self.distanceToPlayerY))*self.abboDeltaVelocity/2;
 					if (self.y < 180) {
 						self.y = 180;
 					} else if (self.y > gameConfig.height) {
 						self.y = gameConfig.height;
 					}
 				} else if (absdistanceToPlayerX >= self.hitRange) {					
 					self.body.velocity.x = (self.distanceToPlayerX/Math.abs(self.distanceToPlayerX))*self.abboDeltaVelocity;
 				}
 			},
 			exit: function() {
 				self.body.velocity.setTo(0,0);
 			}
 		});
 		this.stateMachine.add('hit', {
			hitBox:0,
			enter: function(){
				this.playerHit = false;
			},
			update: function() {
				if(self.animations.currentAnim._frameIndex >= this.hitBox) {
					var currState = this;
					self.game.physics.arcade.collide(self, self.player, function(abbo, player){
						player.registerHit();
						currState.playerHit = true;
					}, function(abbo, player) {
						return (abbo.bottom > player.bottom - 10 && abbo.bottom < player.bottom + 10
							&& !currState.playerHit);
					});
				}
			},
			exit: function(){
				this.playerHit = false
			}
		});
 		this.stateMachine.add('getHit', {
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
 		this.stateMachine.transition('', 'walk', 'hit', function(){
 			debugger
			return(Math.abs(self.distanceToPlayerX) <= self.hitRange && Math.abs(self.distanceToPlayerY) <= 10 );
		});
 		this.stateMachine.transition('', 'hit', 'walk', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
 		this.stateMachine.transition('', 'walk', 'getHit', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
 		this.stateMachine.transition('', 'getHit', 'walk', function(){
			return(!self.animations.currentAnim.isPlaying && (new Date().getTime() -self.stateMachine.timer.getTime() > 1000));
		});
         
       
    }
    Abbobo.prototype = Object.create(Phaser.Sprite.prototype);
    Abbobo.prototype.constructor = Abbobo;
    
    
    Abbobo.prototype.registerHit = function(){
    	if(!this.health){
			return
		}
		this.health -= player.damage
		if (this.stateMachine.currentState == 'getHit') {
		} else {
			this.stateMachine.doTransition('getHit');
		}
	};
   
    Abbobo.prototype.parentCreate = function(){
          this.health = this.maxHealth;       
    };
    
    Abbobo.prototype.drawHealthBar = function (color) {
       
       if (!color) {
         color = 0xFF0000;
       }
       if (this.healthBarShape || this.health <= 0) {
           this.healthBarShape.destroy();
       }     
       //init rect
       var healthBarShapeWidth = this.health * this.body.width / this.maxHealth;
       this.healthBarShape = this.game.add.graphics (0, 0);   
       //shape.lineStyle(2, 0x0000FF, 1);
       this.healthBarShape.beginFill (color, 1);
       //(x, y, w, h)
       this.healthBarShape.drawRect (this.x - healthBarShapeWidth / 2, this.y - this.height - 10, healthBarShapeWidth, 4);
     };
         
    Abbobo.prototype.update = function() { 
    	
    	if(!this.health) {
			this.stateMachine.doTransition('die')
		}
        
    	this.distanceToPlayerX = this.player.x - this.x;
		this.distanceToPlayerY = this.player.y - this.y;   
        this.stateMachine.update();
        this.drawHealthBar();
    }
   
    return Abbobo;
})();