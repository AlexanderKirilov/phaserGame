var game = new Phaser.Game(372, 248, Phaser.AUTO, '', {preload: preload, create:create, update:update});

function preload(){	
	game.load.image('bg', 'assets/levels/Stage_One_Base.png');
	game.load.image('player', 'assets/player/placeHolder.png');
}

var player;
var cursors;
function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.add.sprite(0, 0, 'bg');

	player = game.add.sprite(40, 130, 'player');

	cursors = game.input.keyboard.createCursorKeys();

	game.physics.arcade.enable(player);
}

function update(){

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown){
        //  Move to the left
        player.body.velocity.x = -150;
    }else if (cursors.right.isDown){
        //  Move to the right
        player.body.velocity.x = 150;
    }else{
    }

    if (cursors.up.isDown){
    	player.body.velocity.y =
    }
}