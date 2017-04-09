class DragonBehavior extends Sup.Behavior {
  
  private counter = 0;
  
  private dialogue = { text: "", timer:0 };
  private hitboxes = [];
  private hitboxes2: Sup.ArcadePhysics2D.Body[] = [];
  
  private head;
  private belly;
  private feet;
  private tail;
  
  awake() {
    
    this.head = this.actor.getChild("Hitbox").getChild("Head").getBehavior(HitBehavior);
    this.belly = this.actor.getChild("Hitbox").getChild("Belly").getBehavior(HitBehavior);
    this.feet = this.actor.getChild("Hitbox").getChild("Feet").getBehavior(HitBehavior);
    this.tail = this.actor.getChild("Hitbox").getChild("Tail").getBehavior(HitBehavior);
    
    this.hitboxes = this.actor.getChild("Hitbox").getChildren();
    for ( let hit of this.hitboxes ) {
      this.hitboxes2.push(hit.arcadeBody2D);
    }
  }

  update() {
    
    //if (this.counter > 3)  Game.endGame(true);
    
    // Update dialogue obj
    if ( this.dialogue.timer == 0 ) {
      this.actor.getChild("Dialogue").setVisible(false);
    } else {
      this.actor.getChild("Dialogue").setVisible(true);
      this.dialogue.timer--;
    }
    
    let foodItems = Sup.getActor("Food").getChildren();
    for ( let foodBox of foodItems ) {
      let destroyItem = false;
      for ( let hit of this.hitboxes2 ) {
        // Check intersection with food
        if ( !destroyItem && Sup.ArcadePhysics2D.intersects( foodBox.arcadeBody2D, hit ) ) {
          this.counter++;
          
          let text = this.getReactionText();
          Game.data.dragon = text;
          Game.updateHUD();
          this.actor.getChild("Dialogue").textRenderer.setText("Mm! " + text);
          this.dialogue.timer = 60;
          
          destroyItem = true;
        }
      }
      if (destroyItem) foodBox.destroy();
    }
    // Collide with tilemap
    //Sup.ArcadePhysics2D.collides( this.actor.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
    
    // Check intersection with sword
    
  }
  
  // Determine if dead; Only call when hit
  checkDeathOnHit() {
    this.counter--;
    
    // React to hit
    let text = this.getReactionText();
    this.actor.getChild("Dialogue").textRenderer.setText("Ow! " + text);
    this.dialogue.timer = 60;
    Game.data.dragon = text;
    Game.updateHUD();
    
    if ( this.belly.defense == 0 || this.head.defense == 0 ) {
      // TODO: Play dead
      this.actor.getChild("Dialogue").textRenderer.setText("X(");
      this.dialogue.timer = 60;
      Game.data.dragon = "Slayed!";
      Game.updateHUD();
    }
  }
  
  // Get reaction text
  getReactionText() {
    if (this.counter == 0) return "";
    let text = "";
    if (this.counter > 0) {
      for ( let i = 0; i < this.counter; i++ ) text += "<3 ";
    } else {
      for ( let i = this.counter; i < 0; i++ ) text += "x";
    }
    return text;
  }
  
}
Sup.registerBehavior(DragonBehavior);
