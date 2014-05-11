define( [ "Box2D", "Managers/InputManager", "Game/Propulsor" ], function( Box2D, InputsManager, Propulsor ) {

	var Module = function( world, position )
	{
		this.propulsors = new Array();
	
		this.createBody( world, position );
	}
	
	Module.prototype.update = function( deltaTime )
	{
		for ( var i = 0; i < this.propulsors.length; i++ )
			this.propulsors[i].update( deltaTime );
	}
	
	Module.prototype.render = function( context )
	{
		
	}
	
	Module.prototype.createBody = function( world, position )
	{
		var bodyDef  = new Box2D.BodyDef();
		bodyDef.type = Box2D.Body.b2_dynamicBody;

		bodyDef.position.Set( position.x, position.y );
		
		var fixDef   = new Box2D.FixtureDef();
		fixDef.shape = new Box2D.PolygonShape();
	
		this.defineShape( fixDef );
		
		this.body = world.CreateBody( bodyDef );
		this.body.CreateFixture( fixDef );
		
		this.body.tag = "Ship";
	}
	
	Module.prototype.defineShape = function( fixDef )
	{
		// entity.points == [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y:2}]
		var scale = 2;
		var points = [
			{ first : new Box2D.Vec2( 0, scale ), second : new Box2D.Vec2( -scale * 0.3, scale ) },
			{ first : new Box2D.Vec2( scale, scale ), second : new Box2D.Vec2( 0, scale ) },
			{ first : new Box2D.Vec2( 0, 0 ), second : new Box2D.Vec2( scale, 0 ) },
			{ first : new Box2D.Vec2( scale, 0 ), second : new Box2D.Vec2( scale * 1.5, scale * 0.5 ) },
			{ first : new Box2D.Vec2( scale * 1.5, scale * 0.5 ), second : new Box2D.Vec2( scale, scale ) },
			{ first : new Box2D.Vec2( scale * -0.5, scale * 0.5 ), second : new Box2D.Vec2( 0, 0 ) },
			{ first : new Box2D.Vec2( 0, 0 ), second : new Box2D.Vec2( scale * 0.3, 0 ) },
			{ first : new Box2D.Vec2( 0, scale ), second : new Box2D.Vec2( scale * -0.5, scale * 0.5 ) },
			{ first : new Box2D.Vec2( 0, scale ), second : new Box2D.Vec2( scale * 0.2, scale ) }
		];
		
		this.scale = scale;
		
		this.jointPoints = new Array();
		for ( var i = 0; i < points.length; i++ )
		{
			var first  = points[i].first, 
				second = points[i].second;
		
			this.jointPoints.push( new Box2D.Vec2( 0.5 * ( first.x + second.x ), 0.5 * ( first.y + second.y ) ) );
		}
		
		var shape = [
			new Box2D.Vec2( 0, 0 ),
			new Box2D.Vec2( scale, 0 ),
			new Box2D.Vec2( scale * 1.5, scale * 0.5 ),
			new Box2D.Vec2( scale, scale ),
			new Box2D.Vec2( 0, scale ),
			new Box2D.Vec2( scale * -0.5, scale * 0.5 )
		];
		
		fixDef.shape.SetAsArray( shape, shape.length );	
	}	
	
	Module.prototype.addPropulsor = function( id, force, world )
	{
		var angles = [ 225, 180, 0, 45, 135, 315, 225, 0, 180 ];
		var index = this.propulsors.length;
		
		var pos = { x : this.body.GetPosition().x + this.jointPoints[index].x, y : this.body.GetPosition().y + this.jointPoints[index].y };
		this.propulsors.push( new Propulsor( id, force, pos, angles[index], this.body, world ) ); 
	}
	
	Module.prototype.isFull = function()
	{
		return this.propulsors.length === 9;
	}
	
	Module.prototype.constructor = Module;
	
	return Module;
});