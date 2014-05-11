var express = require('express');
var app     = express();

var server  = require('http').createServer( app );
var io      = require('socket.io').listen(server);
io.set('log level', 1);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile); //make express render html files hopefully :D

require('./server/routes.js')(app);

var players = new Array();
var gameSocket;

io.sockets.on('connection', function(socket) 
{
	console.log( "Someone connected to server, yay" );
	
	socket.on('pushStartReactor', function ( playerId ) {
    //	console.log(data);
    	socket.emit('Allumage du reacteur du joueur X', { my: 'data' });
		
		if ( typeof( gameSocket ) !== "undefined" )
			gameSocket.emit( "activatePropulsor", { id : playerId, activate : true } );
	});
	
	socket.on('unpushStartReactor', function ( playerId ) {
    //	console.log(data);
    	socket.emit("Fin d'allumage du reacteur du joueur X", { my: 'data' });
		
		if ( typeof( gameSocket ) !== "undefined" )
			gameSocket.emit( "activatePropulsor", { id : playerId, activate : false } );
	});
	
	socket.on("remoteConnect", function() {
		var playerId = addPlayer( socket );
		
		console.log( "remote connection" );
		socket.emit( "connectedToServer", playerId );
		
		if ( typeof( gameSocket ) !== "undefined" )
			gameSocket.emit( "addPropulsor", playerId );
	});
	
	socket.on("gameConnect", function() {
		gameSocket = socket;
		for ( var i = 0; i < players.length; i++ )
			gameSocket.emit( "addPropulsor", players[i].id );
		
		console.log( "game connection" );
	});
	
	socket.on( "disconnect", function() { 
		console.log( "disconnected" );
		var player = findSocket( socket );
		if ( player !== -1 && typeof( gameSocket ) !== "undefined" )
		{
			gameSocket.emit( "playerDisconnected", players[player].id );
			players.splice( player, 1 );
		}
	});
});

function addPlayer( playerSocket )
{
	var playerId = ( Math.random() * 9999999 ) | 0;
	players.push( { id : playerId, socket : playerSocket } );
	
	return playerId;
}

function findSocket( playerSocket )
{
	for ( var i = 0; i < players.length; i++ )
		if ( players[i].socket == playerSocket )
			return i;
	
	return -1;
}

console.log( "SERVER ONLINE" );
server.listen(8080);