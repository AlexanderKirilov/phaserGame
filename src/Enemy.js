var Enemy = (function(){
	function Enemy (game, x, y, spriteSheet) {
		Phaser.Sprite.call(this, game, x, y, spriteSheet || 'enemy_sheet');	
	
		game.physics.arcade.enable(this);
		this.EnemyDeltaVelocity = 0.5;
		this.scale.x = -1;
		this.anchor.setTo(0.5, 1);
		this.body.collideWorldBounds = true;
		
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