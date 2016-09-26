var gameWidth = 372;
var gameHeight = 248;
var game = new Phaser.Game(372, 248, Phaser.AUTO, '', {preload: preload, create:create, update:update, render:render});

function preload(){	
	game.load.image('bg', 'assets/levels/Stage_One_Base.png');
	game.load.image('player', 'assets/player/placeHolder.png');
}

var player;
var cursors;
function create(){
    //initiate world
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1417, 248);

    //add level background
    game.add.sprite(0, 0, 'bg');

    //create player
    player = game.add.sprite(40, 130, 'player');
    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;

    //set camera to follow player;
    game.camera.follow(player);
    //set the camera follow to be more beat em up style;
    var camDeadzoneWidth = Math.floor((gameWidth*4)/5 - player.body.width);
    var camDeadzoneHeight = gameHeight;
    console.log(game.camera.deadzone = new Phaser.Rectangle(0, -10, camDeadzoneWidth, camDeadzoneHeight));
    
    //initiate controls
    cursors = game.input.keyboard.createCursorKeys();
}

function update(){
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown){   //  Move to the left
        //prevent from tracing back and keep the player 3 px from the left screen border
        if(player.body.x <= game.camera.x + 3){
            player.body.x = game.camera.x + 3;
        }else{
            player.body.velocity.x = -150;
        }
    }else if (cursors.right.isDown){   //  Move to the right
        player.body.velocity.x = 150;
    }

    if (cursors.up.isDown){
        if(player.body.y <= 86){
            player.body.y = 86;
        }else{
    	   player.body.velocity.y = -150;
        }

    }else if( cursors.down.isDown){
        player.body.velocity.y = 150;
    }
}

function render() {


    /* show the camera deadzone
    var zone = game.camera.deadzone;
    game.debug.context.fillStyle = 'rgba(255,0,0,0.6)';
    game.debug.context.fillRect(zone.x, zone.y, zone.width+player.width, zone.height);
    */

    /*  show the camera debug info
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
    */
}