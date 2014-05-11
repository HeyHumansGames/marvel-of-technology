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
    	socket.emit('Allumage du reacteur', { my: 'data' });
		
		if ( typeof( gameSocket ) !== "undefined" )
			gameSocket.emit( "activatePropulsor", { id : playerId, activate : true } );
	});
	
	socket.on('unpushStartReactor', function ( playerId ) {
    //	console.log(data);
    	socket.emit("Fin d'allumage du reacteur", { my: 'data' });
		
		if ( typeof( gameSocket ) !== "undefined" )
			gameSocket.emit( "activatePropulsor", { id : playerId, activate : false } );
	});
	
	socket.on("remoteConnect", function() {
		var playerId = addPlayer();
		
		console.log( "remote connection" );
		socket.emit( "connectedToServer", playerId );
		
		if ( typeof( gameSocket ) !== "undefined" )
			gameSocket.emit( "addPropulsor", playerId );
	});
	
	socket.on("gameConnect", function() {
		gameSocket = socket;
		for ( var i = 0; i < players.length; i++ )
			gameSocket.emit( "addPropulsor", players[i] );
		
		console.log( "game connection" );
	});
});

function addPlayer()
{
	var id = ( Math.random() * 9999999 ) | 0;
	players.push( id );
	
	return id;
}

console.log( "SERVER ONLINE" );
server.listen(8080);