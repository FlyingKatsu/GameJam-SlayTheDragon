class CollisionBehavior extends Sup.Behavior {
  
  private bbox;
  
  awake() {
    // Set our collision points: Top/AB, Left/AC, Bottom/CD, Right/BD
    this.bbox = Collision2D.getBBox(this.actor);
  }

  update() {
    
  }
  
  getBBox( sensorLocation:string ) {
    return this.bbox[sensorLocation];
  }
  
}
Sup.registerBehavior(CollisionBehavior);
