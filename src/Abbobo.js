var Abbobo = (function(){
    function Abbobo (game, x, y) {
        Phaser.Sprite.call(this, game, x, y,'abbo_sheet'); 
       
          this.parentCreate();
 
          this.maxHealth = 100;
          this.game.physics.arcade.enable(this);
          this.body.collideWorldBounds = true;
          this.anchor.setTo(0.5, 1);
          this.hitAction = false;
          this.isAggro = false; //e.g. if a player is in range
          this.aggroRange = 100;
          this.hitRange = 20;
          this.isEnemy = true;
          this.healthBarShape = null;
          this.abboDeltaVelocity = 0.3;
          this.anchor.setTo(0.5, 1);
          this.damage = 0.5;
          this.exist = true;
          this.alive = true;
         
         
         
          this.movementType = null;
          this.minMovementDistanceX = null;
          this.maxMovementDistanceY = null;
          this.moveRightNextTick = false;
          this.moveDownNextTick = false;
          this.movementTween = null;                 
          this.lastMoveToX = null;
          this.lastMoveToY = null;
          this.lastRecalc = null; //last time the movement was recalculated
          this.secondsAfterRecalMoveTarget = 1;
          this.randomSecondsBeforeRecalcMovement = 0.8;
          this.minimumSecondsBeforeRecalcMovement = 1.8;
          this.randomTimeNextDirectionChange = 0;
       
       
          game.physics.arcade.enable(this);
       
         //define Abbobo's animations
         this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 1, '', 1), 2, true);
         this.animations.add('walk', Phaser.Animation.generateFrameNames('walk/', 0, 4, '', 1), 5, true);
         this.animations.add('hit', Phaser.Animation.generateFrameNames('hit/', 0, 1, '', 1), 2, true);
         this.animations.add('gethit', Phaser.Animation.generateFrameNames('getHit/', 0, 3, '', 1), 4, true);
         this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 0, 0, '', 1), 1, true);
       
         this.game.add.existing(this);
       
    }
    Abbobo.prototype = Object.create(Phaser.Sprite.prototype);
    Abbobo.prototype.constructor = Abbobo;
   
    Abbobo.prototype.parentCreate = function(){
          this.health = this.maxHealth;
         
    };
    Abbobo.prototype.parentUpdate = function() {
        this.getDamage();
   
    }
   
    Abbobo.prototype.getDamage = function() {
        this.animations.play('getHit');
        if (this.hitPoint) {
            if (this.health) {
                this.health -= player.damage;
            } else {
                this.alive = false;
                this.healthBarShape.destroy();             
                this.die();
            }
        }
    }
   
    Abbobo.prototype.die = function() {
        if (!this.alive) {
            this.animations.play('die');
        } else {
            this.animations.play('walk');
        }
    }
     
   
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
     
     Abbobo.prototype.hit = function() {
         this.animations.play('hit');
         this.hitPoint = true;
         
     }
     
     
     Abbobo.prototype.move = function() {
         var self = this;
         this.distanceToPlayer = Math.round(this.game.physics.arcade.distanceBetween(self, player));
           
            if (this.distanceToPlayer <= self.aggroRange) {
                this.isAggro = true;
            }
           
            if (this.isAggro && (this.distanceToPlayer >= this.hitRange) && this.alive) {          
                self.animations.play('walk');
                if (self.x <= player.x) {
                    self.scale.x = 1;
                    self.x += self.abboDeltaVelocity;
                        if(self.y < player.y) {
                            self.y += self.abboDeltaVelocity;
                        }
                        self.y -= self.abboDeltaVelocity;
                } else {
                     self.scale.x = -1;
                     self.x -= self.abboDeltaVelocity;
                     if(self.y > player.y) {
                            self.y -= self.abboDeltaVelocity;
                        }
                        self.y += self.abboDeltaVelocity;
                 }
            } else if (this.alive && this.isAggro && (this.distanceToPlayer <= this.hitRange)){
                self.animations.play('walk  ');
                console.log('Abbo hit');
            }
     }
     
   
   
    Abbobo.prototype.update = function() { 
        if (this.distanceToPlayer <= this.hitRange) {
            this.animations.play('hit');
        }
        this.drawHealthBar();
        this.move();       
        this.parentUpdate();
    }
   
    return Abbobo;
})();