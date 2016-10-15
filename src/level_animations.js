var Fire = (function(){
	function Fire (game, x, y) {
		Phaser.Sprite.call(this, game, x, y, 'fire_animation');	
	
		
		game.physics.arcade.enable(this);
		this.anchor.setTo(0.5, 1);
		
		this.game.add.existing(this);
		
		//define burning barrel animation
		this.animations.add('burn', Phaser.Animation.generateFrameNames('burn/', 0, 3, '', 1), 4, true);
	}
	Fire.prototype = Object.create(Phaser.Sprite.prototype)
	Fire.prototype.constructor = Fire;
	
	Fire.prototype.update = function() {
		this.animations.play('burn');
	}
	return Fire;
})();