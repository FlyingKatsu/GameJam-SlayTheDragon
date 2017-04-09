class WeaponBehavior extends Sup.Behavior {
  itemtype: number;
  
  private timer = 0;
  private isAttacking = false;
  
  private localPos;
  private initialRot;
  
  private deltaX = 0;
  private deltaY = 0;
  
  awake() {
    this.localPos = this.actor.getLocalPosition();
    this.initialRot = this.actor.getLocalEulerAngles();
  }

  update() {
    if (this.isAttacking && this.timer > -1) {
      
      // Process collisions with actors
      let maybeHitActors: Sup.Actor[] = [];
      if ( this.actor.getBehavior(ItemBehavior).owner.getName() == "Player" ) {
          for ( let actor:Sup.Actor of Sup.getActor("Heroes").getChildren() ) {
            maybeHitActors.push(actor);
          }
      } else {
          maybeHitActors.push(Sup.getActor("Player"));
      }
      for ( let dragon:Sup.Actor of Sup.getActor("Dragons").getChildren() ) {
        for (let actor:Sup.Actor of dragon.getChild("Hitbox").getChildren()) {
          maybeHitActors.push(actor);
        }
      }
      
      for ( let actor:Sup.Actor in maybeHitActors ) {
        if ( Sup.ArcadePhysics2D.intersects(actor.arcadeBody2D, this.actor.getChild("Sprite").arcadeBody2D) ) {
          actor.getBehavior(HitBehavior).processHit();
        }
      }
      
      
      // Animate weapon movement
      let flip = this.actor.getChild("Sprite").spriteRenderer.getHorizontalFlip() ? -1 : 1;
      let fliprot = this.actor.getChild("Sprite").spriteRenderer.getHorizontalFlip() ? 180 : 0;
      switch(this.timer) {
        case 0:
        default:
          this.actor.getChild("Sprite").moveLocalX( -this.deltaX );
          this.actor.getChild("Sprite").moveLocalY( -this.deltaY );
          this.deltaX = 0; this.deltaY = 0;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(45 * flip));
          break;
          
        case 1:
          break;
          
        case 2:
          this.actor.getChild("Sprite").moveLocalX( -0.5 * flip );
          this.actor.getChild("Sprite").moveLocalY( -0.5 );
          this.deltaX += -0.5 * flip; this.deltaY += -0.5;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(-30 * flip));
          break;
        
        case 3:
          this.actor.getChild("Sprite").moveLocalX( 0.5 * flip );
          this.actor.getChild("Sprite").moveLocalY( -0.5 );
          this.deltaX += 0.5 * flip; this.deltaY += -0.5;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(0 * flip));
          break;
          
        case 4:
          this.actor.getChild("Sprite").moveLocalX( 1 * flip );
          this.actor.getChild("Sprite").moveLocalY( 0.5 );
          this.deltaX += 1 * flip; this.deltaY += 0.5;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(30 * flip));
          break;
          
        case 5:
          break;
      }
      this.timer--;
    }
  }
  
  attack() {
    this.isAttacking = true;
    this.timer = 5;
  }
}
Sup.registerBehavior(WeaponBehavior);
