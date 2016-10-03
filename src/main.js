var DoubleDragon = (function(gameConfig){
    var game = new Phaser.Game(gameConfig.gameWidth, gameConfig.gameHeight, Phaser.AUTO, gameConfig.parentContainer, null, false, gameConfig.antialias, gameConfig.physicsConfig);

    game.state.add('Boot', GameState.Boot);
    game.state.add('Preloader', GameState.Preloader);
    game.state.add('MainMenu', GameState.MainMenu);
    game.state.add('Game', GameState.Game);
    
    return{
        execute: function(){
            game.state.start('Boot');
        }
    }
}(gameConfig || {/*you can define config here alternativly*/}));