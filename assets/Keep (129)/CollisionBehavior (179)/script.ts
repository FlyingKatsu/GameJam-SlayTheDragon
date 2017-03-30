class CollisionBehavior extends Sup.Behavior {
  
  private collisionPoints;
  
  awake() {
    // Set our collision points: Top/AB, Left/AC, Bottom/CD, Right/BD
    this.collisionPoints = Collision2D.getCollisionPoints(this.actor);
  }

  update() {
    
  }
  
  getCollisionPoints( sensorLocation:string ) {
    return this.collisionPoints[sensorLocation];
  }
  
}
Sup.registerBehavior(CollisionBehavior);
