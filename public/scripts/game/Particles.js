define( [  ], function( ) {
  ParticleEmitter = function (x, y, settings) {
    settings = settings || {};
    var obj = this.staticInstantiate.apply(this, arguments);
    if(obj) 
      return obj;

    // Basic Impact stuff
    // this.id = ++ig.Entity._lastId;
    this.pos = { x: 0, y: 0 };
    this.pos.x = x;
    this.pos.y = y;

    this._maxParticles = 10;
    if (settings.maxParticles)
      this._maxParticles = settings.maxParticles;
    this._particles = [];
    this._active = true;

    this._particleCount = 0;

    this.startColour = [ 255, 255, 0, 0.6 ];
    if (settings.startColour)
      this.startColour = settings.startColour.slice(0);
    
    // this.canvas = ig.system.canvas;
    // this.ctx = this.canvas.getContext('2d');
    
    // this.effectCanvas = ig.system.effectCanvas;
    // this.effectCtx = this.effectCanvas.getContext('2d');

    this._killed = false;
  };
  
  ParticleEmitter.classId = "ParticleEmitter";
  ParticleEmitter.prototype = {
    classId: "ParticleEmitter",

    size: { x: 6, y: 6 },
    vel: {x: 0, y: 0},

    // Particle Properties
    positionRandom: { x: 12, y: 12 },
    sizeRandom: 6,
    speed: 10,
    speedRandom: 10,
    lifeSpan: 1,
    lifeSpanRandom: 0.7,
    angle: -90,
    angleRandom: 360,
    endColour: [ 255, 255, 0, 0 ],

    // EntityPool
    staticInstantiate: function( x, y, settings ) {
      return game.getFromPool( this.classId, x, y, settings );
    },
    // EntityPool
    erase: function() {
      game.putInPool(this);
    },

    reset: function (x, y, settings) {
      settings = settings || {};
      // Basic Impact stuff
      // this.id = ++ig.Entity._lastId;
      this.pos = {x: 0, y: 0};
      this.pos.x = x;
      this.pos.y = y;

      this.vel.x = 0;
      this.vel.y = 0;

      this._maxParticles = 10;
      if (settings.maxParticles)
        this._maxParticles = settings.maxParticles;
      this._particles = [];
      this._active = true;

      this._particleCount = 0;

      this.startColour = [ 255, 255, 0, 1 ];
      if (settings.startColour)
        this.startColour = settings.startColour.slice(0);
      
      // this.canvas = ig.system.canvas;
      // this.ctx = this.canvas.getContext('2d');
      
      // this.effectCanvas = ig.system.effectCanvas;
      // this.effectCtx = this.effectCanvas.getContext('2d');

      this._killed = false;
    },

    addParticle: function(x, y) {
      if(this._particleCount == this._maxParticles) {
        return false;
      }
      // Take the next particle out of the particle pool we have created and initialize it
      var particle = new Particle( x, y, { spawner: this });
      this._particles[ this._particleCount ] = particle;
      // Increment the particle count
      this._particleCount++;
      
      return true;
    },

    update: function(delta) {
      while( this._particleCount < this._maxParticles){
        this.addParticle(this.pos.x, this.pos.y);
      }
      var kill = true;
      for (var i = this._particles.length - 1; i >= 0; i--) {
        if (this._particles[i]._killed === false) {
          kill = false;
          break;
        }
      }

      for(i = 0; i < this._particles.length; i++){
        if (!this._particles[i]._killed) {
          this._particles[i].update(delta);
        }
      }

      if (kill === true)
        this.kill();
    },
    
    render: function(context){        
      for(i = 0; i < this._particles.length; i++){
        if (!this._particles[i]._killed) {
          this._particles[i].render(context);
        }
      }
      // context.drawImage(this.effectCanvas, 0, 0);
    },

    kill: function() {
      this._killed = true;
      this.erase();
    }
  };

  Particle = function(x, y, settings) {
    settings = settings || {};
    var obj = this.staticInstantiate.apply(this, arguments);
    if(obj)
      return obj;
    this.spawner = settings.spawner;

    x = ~~(x + this.spawner.positionRandom.x * this.RANDM1TO1());
    y = ~~(y + this.spawner.positionRandom.y * this.RANDM1TO1());
    
    // Basic Impact stuff
    // this.id = ++ig.Entity._lastId;
    this.pos = {x: 0, y: 0};
    this.pos.x = x;
    this.pos.y = y;
    this.vel = { x: 0, y: 0 };
    this.size = { x: 2, y: 2 };

    var newAngle = (this.spawner.angle + this.spawner.angleRandom * this.RANDM1TO1() ) * ( Math.PI / 180 );
  
    this.vel.x = Math.cos(newAngle) * this.spawner.speed + this.spawner.speedRandom * this.RANDM1TO1();
    this.vel.y = Math.sin(newAngle) * this.spawner.speed + this.spawner.speedRandom * this.RANDM1TO1();
    
    size = this.spawner.size.x + (this.spawner.sizeRandom * Math.random());
    size = size < 0 ? 0 : ~~size;
    this.size.x = size;
    this.size.y = size;
    
    this.timeToLive = this.spawner.lifeSpan + this.spawner.lifeSpanRandom * Math.random();
    
    this.colour = this.spawner.startColour.slice(0);
    this.drawColour = "";
    this.deltaColour = [];
    this.deltaColour[ 0 ] = ( this.spawner.endColour[ 0 ] - this.spawner.startColour[ 0 ] ) / this.timeToLive;
    this.deltaColour[ 1 ] = ( this.spawner.endColour[ 1 ] - this.spawner.startColour[ 1 ] ) / this.timeToLive;
    this.deltaColour[ 2 ] = ( this.spawner.endColour[ 2 ] - this.spawner.startColour[ 2 ] ) / this.timeToLive;
    this.deltaColour[ 3 ] = ( this.spawner.endColour[ 3 ] - this.spawner.startColour[ 3 ] ) / this.timeToLive;
    
    this._killed = false;
  };

  Particle.classId = "Particle";
  Particle.prototype = {
    classId: "Particle",

    maxVel: { x: 500, y: 500},

    RANDM1TO1: function(){ return Math.random() * 2 - 1; },

    reset: function(x, y, settings) {
      settings = settings || {};
      this.spawner = settings.spawner;

      x = ~~(x + this.spawner.positionRandom.x * this.RANDM1TO1());
      y = ~~(y + this.spawner.positionRandom.y * this.RANDM1TO1());
      
      // Basic Impact stuff
      // this.id = ++ig.Entity._lastId;
      this.pos = { x: 0, y: 0 };
      this.pos.x = x;
      this.pos.y = y;
      this.vel = { x: 0, y: 0 };
      this.size = { x: 2, y: 2 };

      var newAngle = (this.spawner.angle + this.spawner.angleRandom * this.RANDM1TO1() ) * ( Math.PI / 180 );
    
      this.vel.x = Math.cos(newAngle) * this.spawner.speed + this.spawner.speedRandom * this.RANDM1TO1();
      this.vel.y = Math.sin(newAngle) * this.spawner.speed + this.spawner.speedRandom * this.RANDM1TO1();
      
      size = this.spawner.size.x + (this.spawner.sizeRandom * Math.random());
      size = size < 0 ? 0 : ~~size;
      this.size.x = size;
      this.size.y = size;
      
      this.timeToLive = this.spawner.lifeSpan + this.spawner.lifeSpanRandom * Math.random();
      
      this.colour = this.spawner.startColour.slice(0);
      this.drawColour = "";
      this.deltaColour = [];
      this.deltaColour[ 0 ] = ( this.spawner.endColour[ 0 ] - this.spawner.startColour[ 0 ] ) / this.timeToLive;
      this.deltaColour[ 1 ] = ( this.spawner.endColour[ 1 ] - this.spawner.startColour[ 1 ] ) / this.timeToLive;
      this.deltaColour[ 2 ] = ( this.spawner.endColour[ 2 ] - this.spawner.startColour[ 2 ] ) / this.timeToLive;
      this.deltaColour[ 3 ] = ( this.spawner.endColour[ 3 ] - this.spawner.startColour[ 3 ] ) / this.timeToLive;
      
      this._killed = false;
    },

    // EntityPool
    staticInstantiate: function( x, y, settings ) {
      return game.getFromPool( this.classId, x, y, settings );
    },
    // EntityPool
    erase: function() {
      game.putInPool(this);
    },

    update: function(delta){
      // If the current particle is alive then update it
      if (this.size.x == 0)
        this.kill();
      else {
        if (this.timeToLive > 0){
          // var delta = ig.system.tick;
          this.timeToLive -= delta;
          // Still have my old transforms
          var r = this.colour[ 0 ] += ( this.deltaColour[ 0 ] * delta );
          var g = this.colour[ 1 ] += ( this.deltaColour[ 1 ] * delta );
          var b = this.colour[ 2 ] += ( this.deltaColour[ 2 ] * delta );
          var a = this.colour[ 3 ] += ( this.deltaColour[ 3 ] * delta );
          // Calculate the rgba string to draw.
          var draw = [];
          draw.push("rgba(" + ( r > 255 ? 255 : r < 0 ? 0 : ~~r ) );
          draw.push( g > 255 ? 255 : g < 0 ? 0 : ~~g );
          draw.push( b > 255 ? 255 : b < 0 ? 0 : ~~b );
          draw.push( (a > 1 ? 1 : a < 0 ? 0 : a.toFixed( 2 ) ) + ")");
          this.drawColour = draw.join( "," );
        } else {
          this.kill();
        }
        this.pos.x += this.vel.x * delta;
        this.pos.y += this.vel.y * delta;
      }
    },

    render: function(context) {
      var halfSize = this.size.x >> 1;
      var x = ~~this.pos.x - game.screen.x;
      var y = ~~this.pos.y - game.screen.y;
      var radgrad = context.createRadialGradient( x + halfSize, y + halfSize, this.size.x, x + halfSize, y + halfSize, halfSize);
      radgrad.addColorStop( 0, this.drawColour);
      context.fillStyle = radgrad;
      context.fillRect(x, y, this.size.x, this.size.x);
    },

    kill: function() {
      this._killed = true;
      this.erase();
    }
  };

  return ParticleEmitter;
});
