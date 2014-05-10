define( [ "Managers/AssetManager" ], function( AssetManager ) {

	var TitleMenu = function( context )
	{
		this.size = { width : context.canvas.width, height : context.canvas.height };
	};
	
	TitleMenu.prototype.update = function( deltaTime )
	{
	
	}
	
	TitleMenu.prototype.render = function( context )
	{
		context.fillStyle = "#000";
		context.fillRect( 0, 0, this.size.width, this.size.height );
		
		context.font = 'italic 40pt Helvetica';
		context.align = 'center';
		context.fillStyle = "#FFF";
		context.fillText('Marvel of Technology', 150, 100);
		
		context.drawImage( AssetManager.instance.images[ "sol" ], 150, 150 );
	}
	
	TitleMenu.prototype.constructor = TitleMenu;
	
	return TitleMenu;
});