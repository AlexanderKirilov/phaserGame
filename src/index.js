var DoubleDragon = (function(){
    
}());


var gameWidth = 372;
var gameHeight = 248;
var game = new Phaser.Game(372, 248, Phaser.AUTO, '', {preload: preload, create:create, update:update, render:render});

function preload(){	
	game.load.image('bg', 'assets/levels/Stage_One_Base.png');
	game.load.image('player', 'assets/player/placeHolder.png');
    game.load.atlasJSONArray('billy_sheet', 'assets/player/billy_sprite.png', 'assets/player/billy_sprite.json');
}

var player;
var cursors;
function create(){
    //initiate world
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 1417, 248);
    game.time.advancedTiming = true;
    
    //disable smoothing for pixel art
    game.stage.smoothed = false;
    game.renderer.renderSession.roundPixels = true;
    //add level background
    game.add.sprite(0, 0, 'bg');

    //create player
    player = game.add.sprite(40, 130, 'billy_sheet');
    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;

    //set player animations
    player.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 3, '',1));
    player.animations.add('walkForward', Phaser.Animation.generateFrameNames('walkforward/', 0, 5, '',1));
    player.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punchleft/', 0, 5   , '', 1));

    //set camera to follow player;
    game.camera.follow(player);
    //set the camera follow to be more beat em up style;
    var camDeadzoneWidth = Math.floor((gameWidth*4)/5 - player.body.width);
    var camDeadzoneHeight = gameHeight;
    game.camera.deadzone = new Phaser.Rectangle(0, -10, camDeadzoneWidth, camDeadzoneHeight);

    //initiate controls
    cursors = game.input.keyboard.createCursorKeys();
}

function update(){
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    var playerDeltaVelocity = 70;
    //check if Hitting NOTE: REDO !
    if(game.input.keyboard.isDown(Phaser.KeyCode.Z)){
        player.animations.play('punchLeft', 5);

    }else{  // else check if walking
        var isMoving = false;
        if (cursors.left.isDown){   //  Move to the left
            //prevent from tracing back and keep the player 2 px from the left screen border
            if(player.body.x <= game.camera.x + 2){
                player.body.x = game.camera.x + 2;
            }else{
                player.body.velocity.x = -playerDeltaVelocity;
            }
            isMoving = true;
        }else if (cursors.right.isDown){   //  Move to the right
            player.body.velocity.x = playerDeltaVelocity;

            player.animations.play('walkForward', 10);
            isMoving = true;
        }

        if (cursors.up.isDown){
            if(player.body.y + player.body.width <= 142){
                player.body.y = 142 - player.body.width;
            }else{
        	   player.body.velocity.y = -playerDeltaVelocity;
            }
            isMoving = true;
        }else if( cursors.down.isDown){
            player.body.velocity.y = playerDeltaVelocity;

            player.animations.play('walkForward', 10);
            isMoving = true;
        }
        //Play idle animation
        if(!isMoving){
            player.play('idle', 2);
        }
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

    /*  show the player bounding box;
    game.debug.context.fillStyle = 'rgba(255,0,0,0.6)';
    game.debug.context.fillRect(player.x, player.y, player.width, player.height);
    */
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
}