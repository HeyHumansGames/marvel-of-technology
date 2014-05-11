define( function( require )
{
	require( "libs/box2d.min" );
	
	var B2D = function()
	{
		B2D.World = Box2D.Dynamics.b2World;
		B2D.Vec2 = Box2D.Common.Math.b2Vec2;
		B2D.DebugDraw = Box2D.Dynamics.b2DebugDraw;
		B2D.Body = Box2D.Dynamics.b2Body;
		B2D.BodyDef = Box2D.Dynamics.b2BodyDef;
		B2D.FixtureDef = Box2D.Dynamics.b2FixtureDef;
		B2D.PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		B2D.CircleShape = Box2D.Collision.Shapes.b2CircleShape;
		B2D.RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
		B2D.ContactListener  = Box2D.Dynamics.b2ContactListener;
		
		B2D.scale = 30;
	};

	return B2D;	
});