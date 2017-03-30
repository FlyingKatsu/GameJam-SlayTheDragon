class TunnelWarpBehavior extends Sup.Behavior {
  targetName:string = "HeroSpawner"; 
  sensor: number = 0;
  
  private target: Sup.Actor;
  private humanActors: Sup.Actor[] = [];
  
  awake() {
    // Set target
    this.target = Sup.getActor( this.targetName );
    // Collect humanoid actors
    this.humanActors.push( Sup.getActor("Player") );
    for ( let heroActor of Sup.getActor("Heroes").getChildren() ) this.humanActors.push( heroActor );
  }
  
  update() {
    
    // Check if colliding with any human actors, and if so, warp them to the target
    for ( let humanActor of this.humanActors ) {
      
      // Using built-in collision
      /*Sup.ArcadePhysics2D.collides( humanActor.arcadeBody2D, this.actor.arcadeBody2D );
      if ( this.actor.arcadeBody2D.getTouches()[ Game.stringLocation[this.sensor] ] ) {
        humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      }*/
      
      // Using custom collision computation      
      // If sensor location is top, only need to check bottom coordinates of humanBody with top coordinates of this body
      if ( Collision2D.collides( 
            this.actor.getPosition(),
            this.actor.getBehavior(CollisionBehavior).getBBox(Game.stringLocation[this.sensor]), 
            humanActor.getPosition(),
            humanActor.getBehavior(CollisionBehavior).getBBox(Game.opposingLocation[this.sensor]) ) ) {
          Sup.log("WARPING");
          humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      }
      
    }
    
  }
  
}
Sup.registerBehavior(TunnelWarpBehavior);
