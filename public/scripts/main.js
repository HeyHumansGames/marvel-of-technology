require.config({
    paths: {
        "socket_io"  : "/socket.io/socket.io",
		"libs"       : "/libs",
		"Box2D"      : "box2D/B2D",
		
		"Managers"   : "managers",
		"Game"       : "game",
		"Menus"      : "menus"
    },
    shim: {
        "socket_io" : {
            exports : "io"
        }
    }
});


require( [ "Game/Game" ], function ( Game ) 
{
	var game = new Game( "game" );
	
	window.game = game;
});