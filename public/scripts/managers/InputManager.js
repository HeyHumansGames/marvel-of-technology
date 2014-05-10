define( [  ], function(  )
{
	var InputManager = function()
	{
		this.KEY_O = false;
		this.KEY_U = false;
		this.KEY_Y = false;
		this.KEY_A = false;
		
		this.KEY_L1 = false;
		this.KEY_R1 = false;
		this.KEY_L2 = false;
		this.KEY_R2 = false;
		
		this.AXIS_LS_X = 0.0;
		this.AXIS_LS_Y = 0.0;
		this.AXIS_RS_X = 0.0;
		this.AXIS_RS_Y = 0.0;
		this.AXIS_L2   = 0.0;
		this.AXIS_R2   = 0.0;
	
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
		if ( window.OCW )
		{
			this.KEY_O = window.OCW.getButton( "o" ); this.KEY_U = window.OCW.getButton( "u" ) == "true";
			this.KEY_Y = window.OCW.getButton( "y" ) == "true"; this.KEY_A = window.OCW.getButton( "a" ) == "true";
			
			this.KEY_L1 = window.OCW.getButton( "l1" ) == "true"; this.KEY_L2 = window.OCW.getButton( "l2" ) == "true";
			this.KEY_R1 = window.OCW.getButton( "r1" ) == "true"; this.KEY_R2 = window.OCW.getButton( "r2" ) == "true";
			
			this.AXIS_LS_X = parseFloat( window.OCW.getAxis( "lsx" ) ); 
			this.AXIS_LS_Y = parseFloat( window.OCW.getAxis( "lsy" ) );
			
			this.AXIS_RS_X = parseFloat( window.OCW.getAxis( "rsx" ) );
			this.AXIS_RS_Y = parseFloat( window.OCW.getAxis( "rsy" ) );
			
			this.AXIS_L2 = parseFloat( window.OCW.getAxis( "al2" ) );
			this.AXIS_R2 = parseFloat( window.OCW.getAxis( "ar2" ) );
		}
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