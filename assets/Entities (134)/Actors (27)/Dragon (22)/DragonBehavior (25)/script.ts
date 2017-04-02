class DragonBehavior extends Sup.Behavior {
  
  private counter = 0;
  
  private dialogue = { text: "", timer:0 };
  private hitboxes = [];
  private hitboxes2: Sup.ArcadePhysics2D.Body[] = [];
  
  awake() {
    this.hitboxes = this.actor.getChild("Hitbox").getChildren();
    for ( let hit of this.hitboxes ) {
      this.hitboxes2.push(hit.arcadeBody2D);
    }
  }

  update() {
    
    if (this.counter > 3)  Game.endGame(true);
    
    // Update dialogue obj
    if ( this.dialogue.timer == 0 ) {
      this.actor.getChild("Dialogue").setVisible(false);
    } else {
      this.actor.getChild("Dialogue").setVisible(true);
      this.dialogue.timer--;
    }
    
    let foodItems = Sup.getActor("Food").getChildren();
    for ( let foodBox of foodItems ) {
      for ( let hit of this.hitboxes2 ) {
        // Check intersection with food
        if ( Sup.ArcadePhysics2D.intersects( foodBox.arcadeBody2D, hit ) ) {
          this.counter++;
          let text = "";
          for ( let i = 0; i < this.counter; i++ ) text += "<3";
          Game.data.dragon = text;
          Game.updateHUD();
          this.actor.getChild("Dialogue").textRenderer.setText(text);
          this.dialogue.timer = 60;
        }
      }
      
    }
    // Collide with tilemap
    //Sup.ArcadePhysics2D.collides( this.actor.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
    
    // Check intersection with sword
    
  }
}
Sup.registerBehavior(DragonBehavior);
