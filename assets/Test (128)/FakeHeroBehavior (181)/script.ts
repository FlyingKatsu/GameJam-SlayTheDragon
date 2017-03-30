class FakeHeroBehavior extends Sup.Behavior {
  
  private humanActor: Sup.Actor;
  
  awake() {
    this.humanActor = Sup.getActor("Player");
  }
  
  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Mapper").arcadeBody2D);
    
    if (Sup.Input.wasKeyJustPressed("SHIFT")) {
      
      let bbox = Collision2D.getBBox(this.actor);
      let otherbbox = Collision2D.getBBox(this.humanActor);
      //Sup.log(bbox.edges);
      Sup.log("Check with Human Bottom");
      Sup.log(otherbbox.seg.bottom);
      Sup.log( Collision2D.collides( bbox.edges, otherbbox.seg.bottom ) );
      
      Sup.log("Check with Human Top");
      Sup.log(otherbbox.seg.top);
      Sup.log( Collision2D.collides( bbox.edges, otherbbox.seg.top ) );
      
      Sup.log("Check with Human Left");
      Sup.log(otherbbox.seg.left);
      Sup.log( Collision2D.collides( bbox.edges, otherbbox.seg.left ) );
      
      Sup.log("Check with Human Right");
      Sup.log(otherbbox.seg.right);
      Sup.log( Collision2D.collides( bbox.edges, otherbbox.seg.right ) );
    }
  }
}
Sup.registerBehavior(FakeHeroBehavior);
