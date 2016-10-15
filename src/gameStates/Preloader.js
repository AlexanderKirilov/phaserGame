(function(GameState){
	//Displays loading and loads all assets
	var Preloader = (function(){
		function Preloader(game){
			//TODO
			this.background = null;
			this.preloadBar = null;

			this.ready = false;
		}
		Preloader.prototype.preload = function(){
			//	These are the assets we loaded in Boot.js
			//	A nice sparkly background and a loading progress bar
			//this.background = this.add.sprite(0, 0, 'preloaderBackground');
			//this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

			//	This sets the preloadBar sprite as a loader sprite.
			//	What that does is automatically crop the sprite from 0 to full-width
			//	as the files below are loaded in.
			//this.load.setPreloadSprite(this.preloadBar);

			//	Here we load the rest of the assets our game needs.
			//	As this is just a Project Template I've not provided these assets, swap them for your own.
			this.load.image('titleScreenBG', 'assets/loadingScreen/dd_title.jpg');
			
			this.load.image('bg', 'assets/levels/Stage_One_Base.png');
			this.load.spritesheet('left_gang', 'assets/level_animations/leftGang.png', 45, 85);
			this.load.spritesheet('right_gang', 'assets/level_animations/rightGang.png', 32, 93);
			this.load.atlasJSONArray('fire_animation', 'assets/level_animations/fire_animation.png', 'assets/level_animations/fire_animation.json' );	
			//player
			this.load.atlasJSONArray('billy_sheet', 'assets/player/billy_sprite.png', 'assets/player/billy_sprite.json');
			//enemy
			this.load.atlasJSONArray('enemy_sheet', 'assets/Enemy/enemy_idle.png', 'assets/Enemy/enemy_idle.json');
			this.load.atlasJSONArray('abbo_sheet', 'assets/Abbobo/Abbobo_sprites.png', 'assets/Abbobo/Abbobo_sprites.json');
			
			//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
			//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
			//	+ lots of other required assets here
		};
		Preloader.prototype.create = function(){
			//Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
			//this.preloadBar.cropEnabled = false;
		};
		Preloader.prototype.update = function(){
			//	You don't actually need to do this, but I find it gives a much smoother game experience.
			//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
			//	You can jump right into the menu if you want and still play the music, but you'll have a few
			//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
			//	it's best to wait for it to decode here first, then carry on.
			
			//	If you don't have any music in your game then put the game.state.start line into the create function and delete
			//	the update function completely.
			/*
			if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
			{
				this.ready = true;
				*/this.state.start('MainMenu');/*
			}*/
		};
		return Preloader;
	})();
	GameState.Preloader = Preloader;
})(GameState || {});
