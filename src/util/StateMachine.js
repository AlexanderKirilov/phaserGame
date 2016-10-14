function StateMachine(entity, opts){
	this.unnamedTransitionCounter = 0;
	
	this.entity = entity;
	this.opts = opts || {};

	this.states = {};
	this.transitions = {};

	//track names
	this.initialState = null;
	this.currentState = null;
	this.previousState = null;
	this.timer = null;
}
StateMachine.prototype.add = function(name, state, animationName){
	if(name && state){
		if(animationName){
			state.animationName = animationName;
		}else{
			state.animationName = name;
		}
		this.states[name] = state;
		if(!this.initialState){
			this.initialState = name;
		}
	}
};
StateMachine.prototype.transition = function(name, fromState, toState, predicate) {
	if (!fromState && !toState && !predicate) {
		return this.transitions[name];
	}
	// Transitions don't require names.
	if (!name){
		name = 'transition-' + this.unnamedTransitionCounter;
		this.unnamedTransitionCounter += 1;
	}
	if (!this.states[fromState]) {
		throw new Error('Missing from state: ' + fromState);
	}
	if (!this.states[toState]) {
		throw new Error('Missing to state: ' + toState);
	}
	var transition = {
		name: name,
		fromState: fromState,
		toState: toState,
		predicate: predicate
	};
	this.transitions[name] = transition;
	return transition;
};
StateMachine.prototype.update = function(){
	// Verify the transitional animation has completed before entering update()
	if( this.lastTransition && 
	(this.entity.animations.currentAnim.name == this.lastTransition.name && this.entity.animations.currentAnim.isPlaying)){
		return;
	}
	//initialState
	if(!this.currentState){
		this.currentState = this.initialState;
	}
	//currentState
	var state = this.states[this.currentState];
	//if change in state ...
	if (this.previousState !== this.currentState) {
		//a callback before changing the animation
		this.previousState = this.currentState;
		if(state.preEnter){
			state.preEnter();
		}
		//change sprite animation
		if(this.opts.debug){
			console.info('Playing state animation: ' + state.animationName);
		}
		this.entity.animations.play(state.animationName);
		//a callback after changing animation
		if(state.enter){
			this.timer = new Date();
			state.enter();
		}
	}
	//handle input right before update
	if(state.handleInput){
		state.handleInput();
	}
	if(state.update){
		state.update();
	}

	// Iterate through transitions.
	for(var name in this.transitions){
		var transition = this.transitions[name];
		if(transition.fromState === this.currentState && transition.predicate()){
			this.lastTransition = transition;
			if(state.exit){
				state.exit();
			}
			if(transition.name !== ''){
				if(this.opts.debug){
					//console.info("Play transitional animation: " + this.lastTransition.name );
				}
				this.entity.animations.play( this.lastTransition.name );
			}
			this.currentState = transition.toState;
			return;
		}
	}
};
StateMachine.prototype.doTransition = function(toState){
	var state = this.states[this.currentState];
	if(state.exit){
		state.exit();
	}
	this.currentState = toState;
};