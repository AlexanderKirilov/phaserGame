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
	if(!this.currentState){
		this.currentState = this.initialState;
	}
	var state = this.states[this.currentState];

	if (this.previousState !== this.currentState) {
		if(this.lastTransition){
			this.entity.animations.play( this.lastTransition.name );
			if(this.opts.debug){
				console.info("Play transitional animation: " + this.lastTransition.name );
			}
		}
		if(state.enter){
			this.timer = new Date();
			state.enter(this.lastTransition);
		}
		this.previousState = this.currentState;
	}

	// Verify the transitional animation has completed before entering update()
	if( this.lastTransition && 
	(this.entity.animations.currentAnim.name == this.lastTransition.name && this.entity.animations.currentAnim.isPlaying)){
		return;
	}


	if( this.entity.animations.currentAnim.name != this.currentState && state.animationName != this.entity.animations.currentAnim.name
		&& state.animationName !== ' '){
		if(this.opts.debug){
			console.info("Play animation: " + this.currentState );
		}
		this.entity.animations.play(this.states[this.currentState].animationName);
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