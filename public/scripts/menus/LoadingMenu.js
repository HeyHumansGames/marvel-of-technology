define( function( AssetManager ) {
	
	var LoadingMenu = function( context )
	{
		this.size = { width : context.canvas.width, height : context.canvas.height };
	}
	
	LoadingMenu.prototype.update = function( deltaTime )
	{
	
	}
	
	LoadingMenu.prototype.render = function( context )
	{
		context.fillStyle = "#000";
		context.fillRect( 0, 0, this.size.width, this.size.height );
		
		context.font = 'italic 40pt Helvetica';
		context.align = 'center';
		context.fillStyle = "#F00";
		context.fillText('Loading', 150, 100);
	}
	
	LoadingMenu.prototype.constructor = LoadingMenu;
	
	return LoadingMenu;

});