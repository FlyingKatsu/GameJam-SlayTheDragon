class TunnelWarpBehavior extends Sup.Behavior {
  targetName:string = "HeroSpawner"; 
  sensor: number = 0;  // Top0 Left1 Bottom2 Right3
  
  private target: Sup.Actor;
  private humanActors: Sup.Actor[] = [];
  private bbox;
  
  awake() {
    // Set target
    this.target = Sup.getActor( this.targetName );
    // Set bbox
    this.bbox = Collision2D.getBBox(this.actor);
    // Collect humanoid actors
    //this.humanActors.push( Sup.getActor("Player") );
    //for ( let heroActor of Sup.getActor("Heroes").getChildren() ) this.humanActors.push( heroActor );
  }
  
  update() {
    
    this.bbox = Collision2D.getBBox(this.actor);
    
    // Update hero list
    this.humanActors.push( Sup.getActor("Player") );
    for ( let heroActor of Sup.getActor("Heroes").getChildren() ) this.humanActors.push( heroActor );
    
    // Check if colliding with any human actors, and if so, warp them to the target
    for ( let humanActor of this.humanActors ) {
      
      // Using built-in collision
      /*Sup.ArcadePhysics2D.collides( humanActor.arcadeBody2D, this.actor.arcadeBody2D );
      if ( this.actor.arcadeBody2D.getTouches()[ Game.stringLocation[this.sensor] ] ) {
        humanActor.arcadeBody2D.warpPosition(this.target.getPosition());
      }*/
      
      // Using custom collision computation      
      // If sensor location is top, only need to check bottom coordinates of humanBody with top coordinates of this body
      if ( Collision2D.collides( this.bbox.edges, Collision2D.getBBox(humanActor).seg[Game.stringLocation[this.sensor]] ) != null ) {
        //Sup.log("WARPING");
        if ( this.sensor === 0 || this.sensor === 2 ) {
          // Maintain relative x pos
          humanActor.arcadeBody2D.warpPosition(humanActor.getPosition().x + (this.target.getPosition().x - this.actor.getPosition().x), this.target.getPosition().y);
        } else {
          // Maintain relative y pos
          humanActor.arcadeBody2D.warpPosition(this.target.getPosition().x, humanActor.getPosition().y + (this.target.getPosition().y - this.actor.getPosition().y));
        }
      }
      
    }
    
    // Clear hero list
    this.humanActors = [];
    
  }
  
}
Sup.registerBehavior(TunnelWarpBehavior);
