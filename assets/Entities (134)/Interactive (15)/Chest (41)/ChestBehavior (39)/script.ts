class ChestBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {
    // Check collision with solid bodies (from tilemap)
    Sup.ArcadePhysics2D.collides( this.actor.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
  }
}
Sup.registerBehavior(ChestBehavior);
