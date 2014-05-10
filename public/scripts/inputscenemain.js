require.config({
    paths: {
        'socket_io'  : '/socket.io/socket.io',
		'HandJS'	 : 'handjs/hand'
    },
    shim: {
        'socket_io': {
            exports: 'io'
        }
    }
});

//Informations du joueur
var idplayer = 0;

require (["socket_io","HandJS"],function(io){

	var c = document.getElementById("interface");
	var ctx = c.getContext("2d");
	c.height = c.width * (9/15);

	ctx.fillStyle = "#F0F0F0";
	ctx.fillRect(0,0, c.width, c.height);

	var tailleW = 20;
	var tailleH = 20;
	ctx.fillStyle = "#B0B0B0";
	ctx.fillRect( tailleW, tailleH, c.width-(2*tailleW), c.height-(2*tailleH));

	//Chargement du fond métalique
	var img = new Image(); //Image du Bouton
	var img2 = new Image(); //Image de Fond
    var posX2 = 20;
    var posY2 = 20;
    img2.onload = function() {
		ctx.drawImage(img2, tailleW, tailleH, c.width-(2*tailleW), c.height-(2*tailleH));
		LoadButtons(img);
	}
    img2.src = '/assets/img/interface/fond.png';

    


    //Gérer les inputs
    var hostAndPort = location.protocol + "//" + location.hostname + ":" + location.port;
    var clientSocket = io.connect(hostAndPort);

	clientSocket.emit( "remoteConnect" );
	
    document.body.addEventListener("pointerdown", function(e){
    	e.preventDefault();
    	img.src = '/assets/img/interface/boutonunhold.png';
    	clientSocket.emit("pushStartReactor", idplayer );
    }, false);

    document.body.addEventListener("pointerup", function(e){
    	e.preventDefault();
		img.src = '/assets/img/interface/boutonhold.png';
    	clientSocket.emit("unpushStartReactor", idplayer );
    }, false);

    clientSocket.on( "connectedToServer", function( id ) {
		idplayer = id;
		console.log( idplayer );
	});
});

function LoadButtons(img){
	var c = document.getElementById("interface");
	var ctx = c.getContext("2d");
	//Chargement du bouton d'activation des réacteurs
    var posX = 100;
    var posY = c.height/2;
    img.onload = function() {
		ctx.drawImage(img, posX, c.height/2-img.height/2);
		ctx.font="bold 30px Calibri";
		ctx.fillStyle = "black";
		ctx.fillText("Commande Réacteur",posX,posY+img.height/2+20);
		
		//Barre de chargement (en %)
		var powerpourcent = 0.5;

		var my_gradient=ctx.createLinearGradient(0,0,350,0);
		my_gradient.addColorStop(0,"yellow");
		my_gradient.addColorStop(1,"red");
		ctx.fillStyle="white";
		ctx.fillRect(posX,posY-img.height+60,256*powerpourcent,45);
		ctx.fillStyle=my_gradient;
		ctx.fillRect(posX,posY-img.height+60,256*powerpourcent,45);
		
		ctx.strokeStyle = "#000000";
		ctx.lineWidth   = 5;
		ctx.strokeRect(posX,posY-img.height+60,256,45);


		var nombredeledhorizontale = 5;
		var nombredeledverticale   = 4;
		for(i=0;i<nombredeledhorizontale;i++){
			for(j=0;j<nombredeledverticale;j++){
				LoadLeds(i,j);
			}
		}
	}
    img.src = '/assets/img/interface/boutonhold.png';
}

function LoadLeds(nbh,nbv){
	var c = document.getElementById("interface");
	var ctx = c.getContext("2d");

	var led = new Image();

	led.onload = function() {
		ctx.drawImage(led, c.width/2+120*(nbh-1), c.width*0.1+120*nbv);
	}
	var randled = Math.floor(Math.random() * 6)+1;
	led.src = '/assets/img/interface/led'+ randled +'.png';
}


