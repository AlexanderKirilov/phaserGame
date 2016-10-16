var StageManager = (function(){
	function StageManager(gameState){
		this.currStage = 0;
		this.stages = [];

		this.game = game;
		this.enemyGroup = gameState.enemyGroup;
	}

	StageManager.prototype.add = function(stage){
		//add the stage
		//limit stage camera
		if(stage.boundRight){
			this.game.camera.bounds.width = stage.boundRight;
		}
		//attach the global enemyGroup
		stage.enemyGroup = this.enemyGroup;
		this.stages.push(stage);
	};
	StageManager.prototype.update = function(){
		var currStage = this.stages[this.currStage];
		if(currStage.update){
			currStage.update();
		}
	};
	StageManager.prototype.advanceStage = function(){
		//call exit
		if(this.stages[this.currStage].exit){
			this.stages[this.currStage].exit();		
		}
		//advance
		this.currStage++;
		//call enter
		if(this.stages[this.currStage].enter){
			this.stages[this.currStage].enter();
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