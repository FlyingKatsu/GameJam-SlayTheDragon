class FakeHeroBehavior extends Sup.Behavior {
  
  private humanActor: Sup.Actor;
  
  awake() {
    this.humanActor = Sup.getActor("Player");
  }
  
  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Mapper").arcadeBody2D);
    
    if (Sup.Input.wasKeyJustPressed("SHIFT")) {

      if ( Collision2D.collides( 
            this.actor.getPosition(),
            this.actor.getBehavior(CollisionBehavior).getBBox("top"), 
            this.humanActor.getPosition(),
            this.humanActor.getBehavior(CollisionBehavior).getBBox("top") ) ) {
          Sup.log("Touched TOP!");
          //this.humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      } else if ( Collision2D.collides( 
            this.actor.getPosition(),
            this.actor.getBehavior(CollisionBehavior).getBBox("left"), 
            this.humanActor.getPosition(),
            this.humanActor.getBehavior(CollisionBehavior).getBBox("left") ) ) {
          Sup.log("Touched LEFT!");
          //this.humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      } else if ( Collision2D.collides( 
            this.actor.getPosition(),
            this.actor.getBehavior(CollisionBehavior).getBBox("bottom"), 
            this.humanActor.getPosition(),
            this.humanActor.getBehavior(CollisionBehavior).getBBox("bottom") ) ) {
          Sup.log("Touched BOTTOM!");
          //this.humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      } else if ( Collision2D.collides( 
            this.actor.getPosition(),
            this.actor.getBehavior(CollisionBehavior).getBBox("right"), 
            this.humanActor.getPosition(),
            this.humanActor.getBehavior(CollisionBehavior).getBBox("right") ) ) {
          Sup.log("Touched RIGHT!");
          //this.humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      } else {
        //NOP
      }
    }
  }
}
Sup.registerBehavior(FakeHeroBehavior);
