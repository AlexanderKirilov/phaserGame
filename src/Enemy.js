var Enemy = (function(){
	function Enemy (game, x, y) {
		Phaser.Sprite.call(this, game, x, y,'enemy_sheet');	
	
		game.physics.arcade.enable(this);
		this.EnemyDeltaVelocity = 0.5;
		this.scale.x = -1;
		this.anchor.setTo(0.5, 1);
		this.body.collideWorldBounds = true;
		
		
		this.game.add.existing(this);
		
		//define Enemy's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 0, 2, '', 1), 3, true);
	}
	Enemy.prototype = Object.create(Phaser.Sprite.prototype)
	Enemy.prototype.constructor = Enemy;
	
	
	Enemy.prototype.update = function() {
		this.animations.play('idle');		
	}
	return Enemy;
})();