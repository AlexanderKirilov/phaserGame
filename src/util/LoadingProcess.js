function LoadingProcess() {

    this.landingSprite = {}; 
    this.preloader = {}; 

    this.loadingProcessInPercentage = {};
}

LoadingProcess.prototype.show = function(showPercentage) {

    this.landingSprite = //background

    this.preloader = // loading animation
    

    //here we prepare text object for percentages
    if(showPercentage) {
        this.loadingProcessInPercentage = game.add.text(game.width / 2 - 20, game.height / 2 - 100, 0 + ' %', {
                                                font: '50px "Press Start 2P"',
                                                fill: '#000000'
                                          });
        this.loadingProcessInPercentage.fixedToCamera = true;
    }
}

LoadingProcess.prototype.hide = function() {

	this.preloader.kill();
    this.landingSprite.kill();
    if(this.loadingProcessInPercentage != null) {
        this.loadingProcessInPercentage.kill();
    }
}