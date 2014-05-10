define( [  ], function(  )
{
	var InputManager = function()
	{
		this.isPropulsorActive = false;
		
		var catchInput = function(e)
		{
			var code = e.keyCode;
			InputManager.instance[code] = true;
		}
		var removeInput = function(e)
		{
			var code = e.keyCode;
			InputManager.instance[code] = false;
		}
		
		window.addEventListener("keydown", catchInput);
		window.addEventListener("keyup", removeInput);
		
		InputManager.instance = this;
	};
	
	InputManager.prototype.getAxis = function( lsx, lsy, rsx, rsy, l2, r2 )
	{
		this.AXIS_LS_X = lsx; this.AXIS_LS_Y = lsy; this.AXIS_RS_X = rsx; this.AXIS_RS_Y = rsy;
		this.AXIS_L2 = l2, this.AXIS_R2 = r2;
	}
	
	InputManager.prototype.update = function( deltaTime )
	{
		this.isPropulsorActive = this["32"];
	}
	
	InputManager.prototype.render = function( context )
	{
	/*    context.font = "Bold 10px Arial";
		
		 context.fillText( "LS X:" + this.AXIS_LS_X, 125, 75 );
		 context.fillText( "LS Y:" + this.AXIS_LS_Y, 170, 75 );
		 context.fillText( "RS X:" + this.AXIS_RS_X, 225, 75 );
		 context.fillText( "RS Y:" + this.AXIS_RS_Y, 300, 75 );
		 context.fillText( "L2:" + this.AXIS_L2, 125, 100 );
		 context.fillText( "R2:" + this.AXIS_R2, 170, 100 );*/
	}
	
	return InputManager;
});