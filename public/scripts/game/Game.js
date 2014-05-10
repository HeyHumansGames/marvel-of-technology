define( [ "Box2D", "Managers/InputManager", "Managers/AssetManager", "Menus/TitleMenu", "Menus/LoadingMenu", "libs/stats.min" ], function( Box2D, InputManager, AssetManager, TitleMenu, LoadingMenu )
{
	var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
    	|| window.mozRequestAnimationFrame
    	|| window.oRequestAnimationFrame
    	|| window.msRequestAnimationFrame
    	|| function(callback) {
    	    window.setTimeout(callback, 1000 / 60);
    	};
	
	var stats = new Stats();
	stats.setMode(0);
	
	//align right 
	stats.domElement.className = "fps";	
	
	document.body.insertBefore( stats.domElement, document.body.firstChild );
	
	var Game = function( canvasID )
	{
		new Box2D();
		new InputManager();
		
		var path = {img:"assets/img/", sound:"assets/sounds/"};
		new AssetManager(path);
	
		this.canvas  = document.getElementById( canvasID );
		this.context = this.canvas.getContext( "2d" );
		
		this.menus = new Array();
		this.menus.push( new LoadingMenu( this.context ) );
		this.menus.push( new TitleMenu( this.context ) );
		
		this.isFinishedLoading = false; //trigger loading change just once D:
		this.currentMenu = 0;
		
		Game.instance = this;

		this.loop( this.gameLoop );
	}

	Game.prototype.update = function( deltaTime )
	{
		if ( !this.isFinishedLoading && !AssetManager.instance.isLoadingAssets() )
		{
			//done loading change to Title Menu ( index 1 );
			this.isFinishedLoading = true;
			this.currentMenu = 1;
		}	
		
		this.menus[ this.currentMenu ].update( deltaTime );
	
		InputManager.instance.update( deltaTime );
	}
	
	Game.prototype.render = function( context )
	{
		
		this.menus[ this.currentMenu ].render( context );
	}
	
	Game.prototype.loop = function( gameLoop ) 
	{
        var _cb = function() 
		{ 
			gameLoop(); 
			requestAnimationFrame( _cb ); 
		};
		
        _cb();
    };
	
	Game.prototype.gameLoop = function()
	{		
		stats.begin();
		
		//right now we are in window scope not game, because AnimFrame! 
		Game.instance.deltaTime = ( Date.now() - Game.instance.deltaTime ) * 0.001;
	
		Game.instance.update( Game.instance.deltaTime );
		Game.instance.render( Game.instance.context );
	
		Game.instance.deltaTime = Date.now();
		
		stats.end();
	}
	
	Game.prototype.constructor = Game;
		
	return Game;
})