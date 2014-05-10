define( [ ], function( ) {
  var Timer = function (seconds) {
    this.target = 0;
    this.base = 0;
    this.last = 0;
    this.pausedAt = 0;

    this.base = Timer.time;
    this.last = Timer.time;
    
    this.target = seconds || 0;
  };
        
  Timer.prototype.set = function( seconds ) {
    this.target = seconds || 0;
    this.base = Timer.time;
    this.pausedAt = 0;
  },
    
  Timer.prototype.reset = function() {
    this.base = Timer.time;
    this.pausedAt = 0;
  },
    
  Timer.prototype.tick = function() {
    var delta = Timer.time - this.last;
    this.last = Timer.time;
    return (this.pausedAt ? 0 : delta);
  },
    
    
  Timer.prototype.delta = function() {
    return (this.pausedAt || Timer.time) - this.base - this.target;
  },

  Timer.prototype.pause = function() {
    if( !this.pausedAt ) {
      this.pausedAt = Timer.time;
    }
  },

  Timer.prototype.unpause = function() {
    if( this.pausedAt ) {
      this.base += Timer.time - this.pausedAt;
      this.pausedAt = 0;
    }
  }

  Timer._last = 0;
  Timer.time = Number.MIN_VALUE;
  Timer.timeScale = 1;
  Timer.maxStep = 0.05;

  Timer.step = function() {
    var current = Date.now();
    var delta = (current - Timer._last) / 1000;
    Timer.time += Math.min(delta, Timer.maxStep) * Timer.timeScale;
    Timer._last = current;
  };

  return Timer;
});