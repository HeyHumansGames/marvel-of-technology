define( [ "Box2D", "Managers/InputManager", "Game/Module" ], function( Box2D, InputsManager, Module )
{
	var propulsorForce = 1;
	var Ship = function( world, position, socket ) 
	{
		//add contact listener
		var listener = new Box2D.ContactListener;
		listener.BeginContact = this.shipCollision;
		
		world.SetContactListener( listener );
		
		this.modules = new Array();
		
		this.addModule( world, position );
		this.initSocket( world, socket );
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
		
		for ( var i = 0; i < this.modules.length; i++ )
			this.modules[i].update( deltaTime );
	}
	
	Ship.prototype.render = function( context )
	{
		// context.strokeStyle = "#FFFFFF";
		// context.fillStyle = "#000000";
		// context.font = "Bold 30px MenuFont";
	    // context.fillText("Score : "+this.score+"", 720, 50);
	    // context.strokeText("Score : "+this.score+"", 720, 50);

	    // context.drawImage(window.Images.collectibles, 0,0,466,1278, 730, 60, 40,40);
	    // context.fillText("x "+this.collectibles+"", 800, 100);
	    // context.strokeText("x "+this.collectibles+"", 800, 100);

	    // for(var key in this.modulesSlots){
	    	// if(this.modulesSlots[key] instanceof Collider){
	    		// this.modulesSlots[key].render(context);
	    	// }
	    // }
		
		// var position = this.body.GetPosition();
		// context.save();	
	}
		
	Ship.prototype.initSocket = function( world, socket )
	{
		var that = this;
		socket.on( "addPropulsor", function( id ) {
			
			console.log( "new propulsor" );
			var module = that.modules[ that.modules.length - 1 ];
			if ( !module.isFull() ) 
				module.addPropulsor( id, propulsorForce, world );
			else
			{
				// var modulePos = module.body.GetPosition();
				// var newPos = new Box2D.Vec2( modulePos.x - module.scale, modulePos.y );
				// module = that.addModule( world, newPos, true );
				
				// //add new propulsor here 
				// module.addPropulsor( id, propulsorForce, world );
			}
		});
		
		socket.on( "activatePropulsor", function( data ) {
			that.activatePropulsor( data.id, data.activate );
		});
		
		socket.on( "playerDisconnected", function( id ) {
			that.destroyPropulsor( id, world );
		});
	}
	
	Ship.prototype.activatePropulsor = function( id, isActive )
	{
		var found = false;
		for ( var i = 0; !found && i < this.modules.length; i++ )
		{
			var module = this.modules[i];
			for ( var j = 0; !found && j < module.propulsors.length; j++ )
			{
				var propulsor = module.propulsors[j];
				if ( propulsor.id == id )
				{
					console.log( "Propulsor " + j );
					propulsor.activate( isActive );
					found = true;
				}
			}
		}
	}
	
	Ship.prototype.destroyPropulsor = function( id, world )
	{
		var found = false;
		for ( var i = 0; !found && i < this.modules.length; i++ )
		{
			var module = this.modules[i];
			for ( var j = 0; !found && j < module.propulsors.length; j++ )
			{
				var propulsor = module.propulsors[j];
				if ( propulsor.id == id )
				{
					propulsor.destroy( world );
					module.propulsors.splice( j, 1 );
					found = true;
				}
			}
		}
	}
	
	/*Ship.prototype.addModule = function(slot, moduleType)
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
	*/
	
	Ship.prototype.addModule = function( world, position, isLink )
	{
		var newModule = new Module( world, position );
		this.modules.push( newModule );
		
		//if link joint it to previous module
		if ( isLink )
		{
			var prevModuleBody = this.modules[ this.modules.length - 1 ].body;
			var jointDef = new Box2D.DistanceJointDef();
			jointDef.Initialize( newModule.body, prevModuleBody, newModule.body.GetWorldCenter(), prevModuleBody.GetWorldCenter() );
			
			world.CreateJoint( jointDef );
		}
		
		return newModule;
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