var Enemy = (function(){
	function Enemy (gameState, x, y, spriteSheet) {
		this.game = gameState.game;
		Phaser.Sprite.call(this, this.game, x, y, spriteSheet || 'enemy_sheet');	
	
		this.game.physics.arcade.enable(this);
		this.scale.x = -1;
		this.anchor.setTo(0.5, 1);

		//keep player reference
		this.player = gameState.player;
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