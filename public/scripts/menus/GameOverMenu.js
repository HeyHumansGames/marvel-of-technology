define( [ "Managers/AssetManager", "Managers/InputManager", "Managers/DialogManager" ], function( AssetManager, InputManager, DialogManager ) {

  var GameOverMenu = function( context )
  {
    this.size = { width : context.canvas.width, height : context.canvas.height };
  };
  
  GameOverMenu.prototype.update = function( deltaTime )
  {
    // Enter
    if (InputManager.instance[13]) {
      game.currentMenu = 1;
      InputManager.instance[13] = false;
    }
  }
  
  GameOverMenu.prototype.render = function( context )
  {
    context.fillStyle = "#000";
    context.fillRect( 0, 0, this.size.width, this.size.height );
    
    context.drawImage( AssetManager.instance.images[ "FondEtoiles720" ], 0, 0 );

    context.font = 'italic 70pt "Architects Daughter"';
    context.align = 'center';
    context.textAlign = 'center';
    context.fillStyle = "#000"
    context.fillText('Game Over...', this.size.width >> 1, this.size.height >> 1);
    context.fillStyle = "rgba(75, 137, 208, 0.4)"
    context.fillText('Game Over...', (this.size.width >> 1) + 7, (this.size.height >> 1) - 1);
    context.fillStyle = "rgba(255, 84, 219, 0.5)"
    context.fillText('Game Over...', (this.size.width >> 1) - 7, (this.size.height >> 1) + 1);
    context.fillStyle = "#FFF";
    context.fillText('Game Over...', this.size.width >> 1, this.size.height >> 1);
  }
  
  GameOverMenu.prototype.constructor = GameOverMenu;

  return GameOverMenu;
});