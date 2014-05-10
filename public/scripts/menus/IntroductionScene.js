define( [ "Managers/AssetManager", "Managers/InputManager", "Managers/DialogManager", "Game/Animation" ], function( AssetManager, InputManager, DialogManager, Animation ) {

  var IntroductionScene = function( context )
  {
    this.size = { width : context.canvas.width, height : context.canvas.height };
    this.dialogs = new DialogManager();
    this.dialogs.add('space-monkey', 'This is... hum... captain speaking. Welcome, PNC aux portes, on board. Terminé.');
    this.dialogs.add('space-monkey', 'We are currently crashing onto an unkown planet. Thank you for flying us. Terminé.');
    this.dialogs.display();
  };
  
  IntroductionScene.prototype.update = function( deltaTime )
  {
    // Enter
    if (InputManager.instance[13]) {
      game.currentMenu += 1;
      InputManager.instance[13] = false;
    }
    // Right arrow
    if (InputManager.instance[39]) {
      this.dialogs.next();
      InputManager.instance[39] = false;
      if (this.dialogs._display === false)
        game.currentMenu += 1;
    }
  }
  
  IntroductionScene.prototype.render = function( context )
  {
    context.fillStyle = "#000";
    context.fillRect( 0, 0, this.size.width, this.size.height );
    
    context.drawImage( AssetManager.instance.images[ "FondEtoiles720" ], 0, 0 );

    this.dialogs.render(context);
  }
  
  IntroductionScene.prototype.constructor = IntroductionScene;
  
  return IntroductionScene;
});