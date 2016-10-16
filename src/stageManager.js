var StageManager = (function(){
	function StageManager(gameState){
		this.currStage = 0;
		this.stages = [];

		this.game = gameState.game;
	}

	StageManager.prototype.add = function(stage){
		//add the stage
		this.stages.push(stage);
	};
	StageManager.prototype.update = function(){
		this.stages[this.currStage].update();
	};
	StageManager.prototype.advanceStage = function(){
		var stage = this.stages[this.currStage];
		//call exit
		if(stage.exit){
			stage.exit();		
		}
		//advance
		this.currStage++;
		//call enter
		//limit stage camera
		if(stage.boundRight){
			this.game.camera.bounds.width = stage.boundRight;
		}
		if(stage.enter){
			stage.enter();
		}
	};
	StageManager.prototype.start = function(){
		this.currStage = 0;

		if(this.stages[this.currStage].enter){
			this.stages[this.currStage].enter();
		}	
	}
	return StageManager; 
})();