var Abbo = (function(){
	function Abbo (game, x, y) {
		Phaser.Sprite.call(this, game, x, y,'abbo_sheet');	
		
		
		game.physics.arcade.enable(this);
		this.abboDeltaVelocity = 0.3;
		this.anchor.setTo(0.5,1);
		//this.scale.x = 1;
		
		this.game.add.existing(this);
		
		//define Abbobo's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 1, '', 1), 2, true);
		this.animations.add('walk', Phaser.Animation.generateFrameNames('walk/', 0, 4, '', 1), 5, true);
		this.animations.add('hit', Phaser.Animation.generateFrameNames('hit/', 0, 1, '', 1), 2, true);
		this.animations.add('gethit', Phaser.Animation.generateFrameNames('getHit/', 0, 3, '', 1), 4, true);
		this.animations.add('die', Phaser.Animation.generateFrameNames('die/', 0, 0, '', 1), 1, true);
		
	}
	Abbo.prototype = Object.create(Phaser.Sprite.prototype);
	Abbo.prototype.constructor = Abbo;
	
	Abbo.prototype.update = function() {	
		
		var self = this;
		/*
		self.scale.x = 1;
		self.animations.play('idle');
		*/
		self.animations.play('hit');
		 if(self.x <= player.x) {
			 self.scale.x = 1;
			 self.x += self.abboDeltaVelocity;
			 	if(self.y <= player.y) {
			 		self.y += self.abboDeltaVelocity;
			 	}
			 	self.y -= self.abboDeltaVelocity;
			 	
			 
		 } else {
			 self.scale.x = -1;
			 self.x -= self.abboDeltaVelocity;
			 if(self.y >= player.y) {
			 		self.y -= self.abboDeltaVelocity;
			 	}
			 	self.y += self.abboDeltaVelocity;
		 }
		 
	 
		
		self.body.collideWorldBounds = true;
		
	}
	return Abbo;
})();