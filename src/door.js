var door = (function(){
	function door (game, x, y) {
		Phaser.Sprite.call(this, game, x, y, 'level_animation');	
	
		
		game.physics.arcade.enable(this);
		this.anchor.setTo(0.5, 1);
		
		this.game.add.existing(this);
		
		//define burning barrel animation
		this.animations.add('door', Phaser.Animation.generateFrameNames('door/', 0, 3, '', 1), 4, false);
		this.frameName = 'door/0'
	}
	door.prototype = Object.create(Phaser.Sprite.prototype)
	door.prototype.constructor = door;
	
	door.prototype.play = function(){
		this.animations.play('door');
	}
	return door;
})();