class PlayerEndBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    /*if ( Sup.Input.wasKeyJustPressed("SPACE") ) {
      if (Game.state == Game.State.Done) { Game.init(); }
      //else { Game.continueGame(); }
    }*/
  }
}
Sup.registerBehavior(PlayerEndBehavior);
