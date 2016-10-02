(function(GameState){
	var MainMenu = (function(){
		function MainMenu(game){

		}
		MainMenu.prototype.create = function(){
			//TODO	We've already preloaded our assets, so let's kick right into the Main Menu itself.

			this.state.start('Game');
		};
		MainMenu.prototype.update = function () {
			//	Do some nice funky main menu effect here
		};
		return MainMenu;
	})();
	GameState.MainMenu = MainMenu;
})(GameState || {});
