var Player = (function(){
	function Player(game, x, y){
		Phaser.Sprite.call(this, game, x, y,'billy_sheet');

		game.physics.arcade.enable(this);
		this.scale.setTo(2, 2);

		this.body.collideWorldBounds = true;
		//set camera to follow player;
		game.camera.follow(this);
		
		//set player animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 3, '',1));
		this.animations.add('walkForward', Phaser.Animation.generateFrameNames('walkforward/', 0, 5, '',1));
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punchleft/', 0, 5   , '', 1));

		this.game.add.existing(this);
		console.log(this);
	}
	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(cursors){
		//  Reset the players velocity (movement)
		this.body.velocity.setTo(0,0);
		
		var playerDeltaVelocity = 70;
		//check if Hitting NOTE: REDO !
		if(this.game.input.keyboard.isDown(Phaser.KeyCode.F)){
			this.animations.play('punchLeft', 5);
		}else{  // else check if walking
			var isMoving = false;
			if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)){   //  Move to the left
			//prevent from tracing back and keep the player 2 px from the left screen border
			if(this.body.x <= this.game.camera.x + 2){
				this.body.x = this.game.camera.x + 2;
			}else{
				this.body.velocity.x = -playerDeltaVelocity;
			}
				isMoving = true;
			}else if (this.game.input.keyboard.isDown(Phaser.KeyCode.D)){   //  Move to the right
				this.body.velocity.x = playerDeltaVelocity;

				this.animations.play('walkForward', 10);
				isMoving = true;
			}

			if (this.game.input.keyboard.isDown(Phaser.KeyCode.W)){
			if(this.body.y + this.body.width <= 142){
				this.body.y = 142 - this.body.width;
			}else{
				this.body.velocity.y = -playerDeltaVelocity;
			}
				isMoving = true;
			}else if( this.game.input.keyboard.isDown(Phaser.KeyCode.S)){
				this.body.velocity.y = playerDeltaVelocity;

				this.animations.play('walkForward', 10);
				isMoving = true;
			}
			//Play idle animation
			if(!isMoving){
				this.play('idle', 2);
			}
		}
	}
	return Player;
})();