class HitBehavior extends Sup.Behavior {
  
  defense = 1;
  
  awake() {
    
  }

  update() {
    
  }
  
  // Update health accordingly; return if dead
  processHit(power:number):boolean {
    
    if (this.defense > 0) {
      this.defense -= power;
      
      if (this.defense <= 0) {
        // handle death
        return true;
      }
    }
    return false;
  }
  
}
Sup.registerBehavior(HitBehavior);
