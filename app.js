var express = require('express');
var app     = express();

var server  = require('http').createServer( app );
var io      = require('socket.io').listen(server);
io.set('log level', 1);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile); //make express render html files hopefully :D

require('./server/routes.js')(app);

io.sockets.on('connection', function(socket) 
{
	console.log( "Someone connected to server, yay" );
	
	

	socket.on('pushStartReactor', function (data) {
    	console.log(data);
    	socket.emit('Allumage du reacteur du joueur X', { my: 'data' });
	});
	socket.on('unpushStartReactor', function (data) {
    	console.log(data);
    	socket.emit("Fin d'allumage du reacteur du joueur X", { my: 'data' });
	});
});

console.log( "SERVER ONLINE" );
server.listen(8080);