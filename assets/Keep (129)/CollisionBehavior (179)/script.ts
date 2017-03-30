class CollisionBehavior extends Sup.Behavior {
  
  private bbox;
  
  awake() {
    // Get bbox edges, verts, segments
    this.bbox = Collision2D.getBBox(this.actor);
  }

  update() {
    
  }
  
  getBBox() {
    return this.bbox;
  }
  
}
Sup.registerBehavior(CollisionBehavior);
