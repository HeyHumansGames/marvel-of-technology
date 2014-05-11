define( [ "Box2D", "Managers/InputManager", "libs/Vectors", "Game/Animation" ], function( Box2D, InputManager, Vectors, Animation )
{
	var box2DScale = 30;
	var Propulsor = function( id, force, position, angle, shipBody, world )
	{
		this.id = id;
		this.isActive = false;
		
		this.createPropulsor( position, angle, shipBody, world );
	
		this.force = force;
		
		this.animOff = new Animation("ReacteurMoT", 20, 32, 0.1, [0]);
		this.animOn = new Animation("ReacteurMoT", 20, 32, 0.1, [1, 2, 3, 4]);
		
		this.currentAnim = this.animOff;
	}
	
	Propulsor.prototype.update = function( deltaTime )
	{
		if ( this.isActive )
			this.applyForce();
		
		this.currentAnim = this.isActive ? this.animOn : this.animOff;
		this.currentAnim.update();
	}

	Propulsor.prototype.render = function( context, offset )
	{
		var pos   = this.body.GetPosition();
		var angle = this.body.GetAngle();
		
		context.save();
		
			context.translate( pos.x * Box2D.scale, pos.y * Box2D.scale );
			context.rotate(this.body.GetAngle() - Math.PI );
			
			this.currentAnim.render( context, -this.currentAnim.width * 0.5, -this.currentAnim.height * 0.25 );
		
		context.restore();
	}

	Propulsor.prototype.createPropulsor = function( position, angle, shipBody, world )
	{
		var bodyDef  = new Box2D.BodyDef();
		bodyDef.type = Box2D.Body.b2_dynamicBody;

		bodyDef.position.Set( position.x, position.y );
		
		var fixDef = new Box2D.FixtureDef();
		fixDef.shape = new Box2D.PolygonShape();
		fixDef.shape.SetAsBox( 16 / box2DScale, 16 / box2DScale );
		fixDef.isSensor = true;
		
		this.body = world.CreateBody( bodyDef );
		this.body.CreateFixture( fixDef );
		
		this.body.SetPositionAndAngle( new Box2D.Vec2( position.x, position.y ), angle * Math.PI / 180 );
		
		//link fixture to body
		var jointDef = new Box2D.RevoluteJointDef();
		jointDef.Initialize( shipBody, this.body, shipBody.GetWorldCenter() );
		
		this.joint = world.CreateJoint( jointDef );
	}
	
	Propulsor.prototype.applyForce = function()
	{
		var dir = this.body.GetLocalVector( new Box2D.Vec2( 0, -1 ) );
		dir.y *= -1; //up force :D
		
		this.body.ApplyForce( Vectors.mult( dir, this.force ), this.body.GetPosition() );
	}
	
	Propulsor.prototype.activate = function( isActive )
	{
		console.log( "Propulsor " + ( isActive ? "activated" : "deactivated" ) );
		this.isActive = isActive;
	}
	
	Propulsor.prototype.destroy = function( world )
	{
		world.DestroyJoint( this.joint );
		world.DestroyBody( this.body );
	}
	
	Propulsor.prototype.constructor = Propulsor;

	return Propulsor;
});