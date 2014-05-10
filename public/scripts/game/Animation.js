define( [  "Managers/AssetManager", "game/Timer" ], function( AssetManager, Timer ) {
  var Animation = function (image, width, height, frameTime, sequence) {
    this.image = image;
    this.frameTime = frameTime;
    this.sequence = sequence;
    this.timer = new Timer(frameTime);
    this.width = width;
    this.height = height;
    this.index = 0;
  };
        
  Animation.prototype.render = function( context, x, y ) {
    context.drawImage( AssetManager.instance.images[ this.image ], this.sequence[this.index] * this.width, 0, this.width, this.height, x, y, this.width, this.height);
  };
    
  Animation.prototype.update = function() {
    if(this.timer.delta() >= 0) {
      this.index = (this.index+1)%this.sequence.length
      this.timer.reset();
    }
  };

  return Animation;
});