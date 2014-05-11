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
		var scale = 4;
		var points = [
			new Box2D.Vec2( 0, 0 ),
			new Box2D.Vec2( scale, 0 ),
			new Box2D.Vec2( scale * 1.5, scale * 0.5 ),
			new Box2D.Vec2( scale, scale ),
			new Box2D.Vec2( 0, scale ),
			new Box2D.Vec2( scale * -0.5, scale * 0.5 )
		];
		
		this.scale = scale;
		
		this.jointPoints = new Array();
		for ( var i = 0; i < points.length - 1; i++ )
			this.jointPoints.push( new Box2D.Vec2( 0.5 * ( points[i+1].x + points[i].x ), 0.5 * ( points[i+1].y + points[i].y ) ) );
		//add last joint to loop
		this.jointPoints.push( new Box2D.Vec2( 0.5 * ( points[ points.length - 1 ].x + points[0].x ), 0.5 * ( points[ points.length - 1 ].y, points[0].y ) ) );
		
		fixDef.shape.SetAsArray( points, points.length );
	}	
	
	Module.prototype.addPropulsor = function( id, force, world )
	{
		var angles = [ 0, 45, 135, 180, 225, 315 ];
		var index = this.propulsors.length;
		
		var pos = { x : this.body.GetPosition().x + this.jointPoints[index].x, y : this.body.GetPosition().y + this.jointPoints[index].y };
		this.propulsors.push( new Propulsor( id, force, pos, angles[index], this.body, world ) ); 
	}
	
	Module.prototype.isFull = function()
	{
		return this.propulsors.length === 4;
	}
	
	Module.prototype.constructor = Module;
	
	return Module;
});