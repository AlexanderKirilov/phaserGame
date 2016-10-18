var StageMachine = (function(){
	function StageMachine(gameState){
		this.unnamedStageCounter = 0;
		this.currStage = 0;
		this.stages = [];

		this.initialStage = null
		this.game = gameState.game;
	}

	StageMachine.prototype.add = function(stage){
		//add stage
		this.stages.push(stage);
	};
	StageMachine.prototype.update = function(){
		this.stages[this.currStage].update();
	};
	StageMachine.prototype.advanceStage = function(){
		var stage = this.stages[this.currStage];
		//call exit
		if(stage.exit){
			stage.exit();		
		}
		//advance
		this.currStage++;

		stage = this.stages[this.currStage];
		//limit stage camera
		if(stage.boundRight){
			this.game.camera.bounds.width = stage.boundRight;
		}
		//call enter
		if(stage.enter){
			stage.enter();
		}
	};
	//give the machine initial push
	StageMachine.prototype.start = function(){
		this.currStage = 0;
		var stage = this.stages[this.currStage];
		//limit stage camera
		if(stage.boundRight){
			this.game.camera.bounds.width = stage.boundRight;
		}

		if(stage.enter){
			stage.enter();
		}	
	}
	return StageMachine; 
})();