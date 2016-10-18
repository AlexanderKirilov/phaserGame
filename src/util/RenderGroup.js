var RenderGroup = (function(){

	/**
	 * Renders the given display objects using the given render session.
	 */
	function renderDisplayObjects(displayObjects, renderSession) {
		for (var i = 0; i < displayObjects.length; i++) {
			displayObjects[i]._renderWebGL(renderSession);
		}
	}

	/**
	 * Returns all the children for the given group recursively.
	 */
	function getChildrenRecursive(group) {
		var children = [];

		for (var i = 0; i < group.children.length; i++) {
			if (group.children[i] instanceof Phaser.Group) {
				children = [].concat(children).concat(getChildrenRecursive(group.children[i]));
			} else {
		  		children.push(group.children[i]);
			}
		}

		return children;
	}

	/* Custom Phaser Group that allows for sorting all of it's children recursively.
	 * http://www.html5gamedevs.com/topic/3085-depth-sort-multiple-groups/
	 */
	function RenderGroup(game, parent, name, addToStage){
		this.game = game;
		Phaser.Group.call(this, this.game, parent, name, addToStage);

    	this._allChildren = []
	}
	RenderGroup.prototype = Object.create(Phaser.Group.prototype);
	RenderGroup.prototype.constructor = RenderGroup;
  
	RenderGroup.prototype._renderWebGL = function(renderSession) {
		if (!this.visible || this.alpha <= 0) {
			return;
		}

		if (this._cacheAsBitmap) {
			this._renderCachedSprite(renderSession);
			return;
		}

		if (this._mask || this._filters) {
			if (this._mask) {
				renderSession.spriteBatch.stop();
				renderSession.maskManager.pushMask(this.mask, renderSession);
				renderSession.spriteBatch.start();
			}

			if (this._filters) {
				renderSession.spriteBatch.flush();
				renderSession.filterManager.pushFilter(this._filterBlock);
			}

			renderDisplayObjects(this._allChildren, renderSession);

			renderSession.spriteBatch.stop();

			if (this._filters) {
				renderSession.filterManager.popFilter();
			}

			if (this._mask) {
				renderSession.maskManager.popMask(renderSession);
			}

			renderSession.spriteBatch.start();
		} else {
			renderDisplayObjects(this._allChildren, renderSession);
		}
	}

	RenderGroup.prototype.sort = function(index, order) {
		if(this.children.length < 2){
			return;
		}
	    if(typeof index === 'undefined') {
			index = 'z';
		}
		if (typeof order === 'undefined') {
			order = Phaser.Group.SORT_ASCENDING;
		}

	    this._sortProperty = index;
	    this._allChildren = getChildrenRecursive(this);

	    // sort the appropriate array in the appropriate way
	    if (order === Phaser.Group.SORT_ASCENDING) {
			this._allChildren.sort(this.ascendingSortHandler.bind(this));
	    } else {
			this._allChildren.sort(this.descendingSortHandler.bind(this));
	    }

		this.updateZ();
  	}
	return RenderGroup;
})();