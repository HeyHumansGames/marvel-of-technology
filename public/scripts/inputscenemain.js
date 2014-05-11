

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

require (["socket_io","Managers/InputManager", "HandJS" ],function(io, InputManager){

	var c = document.getElementById("interface");
	var ctx = c.getContext("2d");
	c.height = c.width * (9/15);

    var requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.oRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| function(callback) {
	    window.setTimeout(callback, 1000 / 60);
	};

	var Controller = function (c){
		new InputManager();
		this.c  = document.getElementById(c);
		this.ctx = c.getContext("2d");
		this.powerpourcent = 0;

		Controller.instance = this;

		this.loop( this.gameLoop );
	};

	Controller.prototype.loop = function( gameLoop ) {
        var _cb = function() 
		{ 
			gameLoop(); 
			requestAnimationFrame( _cb ); 
		};
		
        _cb();
    };

    Controller.prototype.gameLoop = function(){		
 
		var inst = Controller.instance;
		inst.deltaTime = ( Date.now() - inst.deltaTime ) * 0.001;
		if(InputManager.instance["touch"]){
			inst.powerpourcent += 1.0*inst.deltaTime;
			if(inst.powerpourcent>1)
				inst.powerpourcent = 1;
		}
		else{
			inst.powerpourcent -= 1.0*inst.deltaTime;
			if(inst.powerpourcent<0)
				inst.powerpourcent = 0;
		}
		//console.log(inst.powerpourcent);
		//Barre de chargement (en %)
		var my_gradient = inst.ctx.createLinearGradient(0,0,350,0);
		var posX = 100;
    	var posY = 164;
		my_gradient.addColorStop(0,"yellow");
		my_gradient.addColorStop(1,"red");
		inst.ctx.fillStyle = "white";
		inst.ctx.fillRect(posX,posY,256,45);
		inst.ctx.fillStyle = my_gradient;
		inst.ctx.fillRect(posX,posY,256*inst.powerpourcent,45);

		Controller.instance.deltaTime = Date.now();
	};
 
 	var controller = new Controller(c);
 	controller.powerpourcent = 0;

 	Controller.prototype.constructor = Controller;

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

    //Informations du joueur
    var idplayer = 0;

    //Gérer les inputs
    var hostAndPort = location.protocol + "//" + location.hostname + ":" + location.port;
    var clientSocket = io.connect(hostAndPort);

    document.body.addEventListener("pointerdown", function(e){
    	e.preventDefault();
    	InputManager.instance["touch"] = true;
    	img.src = '/assets/img/interface/boutonunhold.png';
    	clientSocket.emit("pushStartReactor", {message : 'Joueur '+ idplayer +': Réacteur Activé Capitaine!'});
    }, false);

    document.body.addEventListener("pointerup", function(e){
    	e.preventDefault();
    	InputManager.instance["touch"] = false;
		img.src = '/assets/img/interface/boutonhold.png';
    	clientSocket.emit("unpushStartReactor", {message : 'Joueur '+ idplayer +': Réacteur Désactivé Capitaine!'});
    }, false);

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
			
			ctx.strokeStyle = "#000000";
			ctx.lineWidth   = 10;
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

	return Controller;
});



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
