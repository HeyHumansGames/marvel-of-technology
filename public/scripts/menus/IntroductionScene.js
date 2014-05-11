define( [ "Managers/AssetManager", "Managers/InputManager", "Managers/DialogManager", "Game/Animation" ], function( AssetManager, InputManager, DialogManager, Animation ) {

  var IntroductionScene = function( context )
  {
    this.size = { width : context.canvas.width, height : context.canvas.height };
    this.dialogs = new DialogManager();
    this.dialogs.add('space-monkey', 'Cap\'tain ! Une planète fertile et ensoleillée !');
    this.dialogs.add('captain', 'Je n’y croyais plus, Matelots ! Mettez le vaisseau en orbite, et en douceur !');
    this.dialogs.add('captain', 'En douceur, incapables ! Vous avez déjà tout oublié du pilotage ?');
    this.dialogs.add('captain', 'Pourtant vous n’avez qu’un bouton chacun ! Appuyez sur le bouton de votre réacteur pour mettre les gaz !');
    this.dialogs.add('captain', 'Pas tous à la fois, mille sabords ! Vous voulez arriver sur la terre promise en un morceau ou bien ? Du doigté !');
    this.dialogs.add('space-monkey', 'Un astéroïde, Cap\'tain !');
    this.dialogs.add('captain', 'Du calme, matelots ! Vous êtes entraînés pour faire face à cette situation !');
    this.dialogs.add('space-monkey', 'Cap\'tain ! Le moteur bananier auxiliaire ne répond plus !');
    this.dialogs.add('space-monkey', 'Nous sommes pris dans le champ gravitationnel de la planète!');
    this.dialogs.add('captain', 'Les dés sont jetés. Il nous faut atterrir!');
    
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