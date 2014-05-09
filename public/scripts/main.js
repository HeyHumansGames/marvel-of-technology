require.config({
    paths: {
        'socket_io'  : '/socket.io/socket.io',
    },
    shim: {
        'socket_io': {
            exports: 'io'
        }
    }
});


require( [ "socket_io" ], function ( io ) 
{
	var hostAndPort = location.protocol + "//" + location.hostname + ":" + location.port;
	
	var clientSocket = io.connect( hostAndPort );
});