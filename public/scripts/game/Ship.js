define( [ "Box2D", "Managers/InputManager", "Game/Propulsor", "socket_io" ], function( Box2D, InputsManager, Propulsor, io )
{
	var box2DScale = 30;
	var Ship = function( world, position ) 
	{
		//add contact listener
		var listener = new Box2D.ContactListener;
		listener.BeginContact = this.shipCollision;
		
		world.SetContactListener( listener );
		
		this.createShipBody( world, position );
		this.addPropulsors( world, position );
		
		//create socket connection 
		this.socket = io.connect( location.protocol + "//" + location.hostname + ":" + location.port );
	}
	
	Ship.prototype.update = function( deltaTime )
	{
		// if(!this.dead)
		// {
			// this.checkInputs(start);
			// for(var i in this.modulesSlots)
			// {
				// var oneAlive = false;
				// if( this.modulesSlots[i] instanceof Collider )
				// {
					// this.modulesSlots[i].update(deltaTime, this.world );
					// if(this.modulesSlots[i].body.GetPosition().y < 20)
						// oneAlive = true;
					// if(this.modulesSlots[i].hp <= 0)
					// {
						// this.modulesSlots[i] = {};
					// }
				// }
			// }

			// if(!oneAlive)
				// this.die();
		// }
		
		for ( var i = 0; i < this.propulsors.length; i++ )
			this.propulsors[i].update( deltaTime );
	}
	
	Ship.prototype.render = function(context)
	{
		context.strokeStyle = "#FFFFFF";
		context.fillStyle = "#000000";
		context.font = "Bold 30px MenuFont";
	    context.fillText("Score : "+this.score+"", 720, 50);
	    context.strokeText("Score : "+this.score+"", 720, 50);

	    context.drawImage(window.Images.collectibles, 0,0,466,1278, 730, 60, 40,40);
	    context.fillText("x "+this.collectibles+"", 800, 100);
	    context.strokeText("x "+this.collectibles+"", 800, 100);

	    for(var key in this.modulesSlots){
	    	if(this.modulesSlots[key] instanceof Collider){
	    		this.modulesSlots[key].render(context);
	    	}
	    }
	}
	
	Ship.prototype.createShipBody = function( world, position )
	{
		var bodyDef  = new Box2D.BodyDef();
		bodyDef.type = Box2D.Body.b2_dynamicBody;

		bodyDef.position.Set( position.x, position.y );
		
		var fixDef   = new Box2D.FixtureDef();
		fixDef.shape = new Box2D.PolygonShape();
		
		this.defineShipShape( fixDef );
		
		this.body = world.CreateBody( bodyDef );
		this.body.CreateFixture( fixDef );
		
		this.body.tag = "Ship";
	}
	
	Ship.prototype.defineShipShape = function( fixDef )
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
		
		this.jointPoints = new Array();
		for ( var i = 0; i < points.length - 1; i++ )
			this.jointPoints.push( new Box2D.Vec2( 0.5 * ( points[i+1].x + points[i].x ), 0.5 * ( points[i+1].y + points[i].y ) ) );
		//add last joint to loop
		this.jointPoints.push( new Box2D.Vec2( 0.5 * ( points[ points.length - 1 ].x + points[0].x ), 0.5 * ( points[ points.length - 1 ].y, points[0].y ) ) );
		
		fixDef.shape.SetAsArray( points, points.length );
	}	
	
	Ship.prototype.addPropulsors = function( world, position )
	{
		this.propulsors = new Array();
		var angles = [ 0, 45, 135, 180, 225, 315 ]
	//	for ( var i = 0; i < this.jointPoints.length/2+1; i++ )
		{
			var i = 4;
			var pos = { x : this.body.GetPosition().x + this.jointPoints[i].x, y : this.body.GetPosition().y + this.jointPoints[i].y };
			this.propulsors.push( new Propulsor( Math.random * 10, 60, pos, angles[i], this.body, world ) );
		}
	}
	
	Ship.prototype.activatePropulsor = function( id, isActive )
	{
		var found = false;
		for ( var i = 0; !found && i < this.propulsors.length; i++ )
		{
			var propulsor = this.propulsors[i];
			if ( propulsor.id = id )
			{
				this.propulsor.activate( isActive );
				found = true;
			}
		}
	}
	
	Ship.prototype.addModule = function(slot, moduleType)
	{
		var position = this.modulesSlots[slot];
		switch(moduleType)
		{
			case "collider" :
				this.modulesSlots[slot] = new Collider("square", [0.5,0.5], [position.x+this.position[0], position.y+this.position[1]], this.world);
				this.modulesSlots[slot].parent = this;
			break;
			case "propulsor" :
				this.modulesSlots[slot] = new Propulsor("square", [0.5,0.5], [position.x+this.position[0], position.y+this.position[1]], this.world);
				this.modulesSlots[slot].parent = this;
			break;
		}
		if(this.nbModules > 0)
		{
			var jointDef = new Box2D.RevoluteJointDef();
				jointDef.Initialize(this.firstModule.body, this.modulesSlots[slot].body, this.modulesSlots[slot].body.GetWorldCenter());
				jointDef.enableLimit = true;
				
				var joint = this.world.CreateJoint(jointDef);
				this.modulesSlots[slot].joint = joint;
				this.joins.push( joint );
		}
		else
			this.firstModule = this.modulesSlots[slot];

		this.nbModules++;
	}
	
	Ship.prototype.shipCollision = function( contact )
	{
		var bodies = [ contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody() ];
		var shipIndex = ( bodies[0].tag === "ship" ) ? 0 : -1;
		shipIndex = ( bodies[1].tag === "ship" ) ? 1 : shipIndex;
		
		if ( shipIndex === -1 )
			return;
		
		if ( bodies[0].tag === bodies[1].tag )
			return;
		
		var module = bodies[shipIndex].module;
		if(bodies[1 - shipIndex] === null || bodies[1 - shipIndex] === undefined)
			var obstacle = bodies[shipIndex + 1];
		else
			var obstacle = bodies[1 - shipIndex];

		//module hit print type
		if ( module instanceof Collider && obstacle.tag !== "wind" && obstacle.tag !== "collectible")
		{
			module.hp = Math.max( 0, module.hp - 0.5 );
		}
	}
	
	Ship.prototype.die = function()
	{
		this.dead = true;
		for(var i in this.modulesSlots)
			delete this.modulesSlots[i];

		this.joins.length = 0;
	}
	
	Ship.prototype.checkInputs = function(start)
	{
		if(InputsManager.instance.AXIS_LS_Y > 0)
		{
			for(var i in this.modulesSlots)
			{
				if(i.split("-")[1] == "left" && this.modulesSlots[i] instanceof Collider )
				{
					var module = this.modulesSlots[i];
					var direction = module.body.GetLocalVector(new Box2D.Vec2(0,-1));
					direction.x *= -1;
					module.force.x *= InputsManager.instance.AXIS_LS_X;
					module.force.y *= InputManager.instance.AXIS_LS_Y;
					var force = Vectors.mult(direction, module.force);
					module.body.ApplyForce(force, module.body.GetPosition());
				}
			}
		}
		if( InputsManager.instance.AXIS_RS_Y > 0)
		{
			var haveMoved = false;
			var nbMods = 0;
			for(var i in this.modulesSlots)
			{
				if(this.modulesSlots[i] instanceof Collider)
				{
					var module = this.modulesSlots[i];
					var direction = module.body.GetLocalVector(new Box2D.Vec2(0,-1));
					direction.x *= -1;
					module.force.x *= InputsManager.instance.AXIS_RS_X;
					module.force.y *= InputsManager.instance.AXIS_RS_Y;
					
					var force = Vectors.mult(direction, module.force);
					module.body.ApplyForce(force, module.body.GetPosition());
				}
			}
			if(haveMoved && start)
				this.score+= 10 - nbMods;
		}
		if(InputsManager.instance["39"] == true)
		{
			var haveMoved = false;
			var nbMods = 0;
			for(var i in this.modulesSlots)
			{
				if(this.modulesSlots[i] instanceof Collider)
				{
					nbMods++;
					if(i.split("-")[1] == "right" || i.split("-")[1] == "top")
					{
						var module = this.modulesSlots[i];
						var direction = module.body.GetLocalVector(new Box2D.Vec2(0,-1));
						direction.x *= -1;
						var force = Vectors.mult(direction, module.force);
						module.body.ApplyForce(force, module.body.GetPosition());
						haveMoved = true;
					}
				}
			}
			if(haveMoved && start)
				this.score+= 10 - nbMods;
		}
	}
	Ship.prototype.constructor = Ship;

	return Ship;
});