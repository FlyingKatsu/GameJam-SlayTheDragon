class WeaponBehavior extends Sup.Behavior {
  itemtype: number;
  power:number =  1;
  
  private timer = 0;
  private isAttacking = false;
  private hitProcessed = false;
  
  private localPos;
  private initialRot;
  
  private deltaX = 0;
  private deltaY = 0;
  
  awake() {
    this.localPos = this.actor.getLocalPosition();
    this.initialRot = this.actor.getLocalEulerAngles();
  }

  update() {
    
    if (this.isAttacking && !this.hitProcessed) {
      
      // Process collisions with actors
      //Sup.log("Owner: " + this.actor.getBehavior(ItemBehavior).owner.getName());
      //Sup.log("Sword Pos: " + this.actor.getChild("Sprite").getPosition());
      
      // Hero Hits
      if ( this.actor.getBehavior(ItemBehavior).owner.getName() == "Player" ) { 
          for ( let hero of Sup.getActor("Heroes").getChildren() ) {
            if ( Sup.ArcadePhysics2D.intersects(hero.arcadeBody2D, this.actor.getChild("Sprite").arcadeBody2D) ) {
              this.hitProcessed = true;
              Sup.log("Hit Hero");
              let isDead = hero.getBehavior(HitBehavior).processHit(this.power);
              if (isDead) {
                // TODO: Death sequence                
              } else {
                // TODO: Retaliate
              }
            }
          }
      // Player Hits
      } else { 
          if ( Sup.ArcadePhysics2D.intersects(Sup.getActor("Player").arcadeBody2D, this.actor.getChild("Sprite").arcadeBody2D) ) {
            this.hitProcessed = true;
            Sup.log("Hit Player");
            let isDead = Sup.getActor("Player").getBehavior(HitBehavior).processHit(this.power);
            Game.data.heart -= this.power;
            Game.updateHUD();
            if (Game.data.heart <= 0) {
              // TODO: Game over sequence
            }
          }
      }
      // Dragon Hits
      for ( let dragon of Sup.getActor("Dragons").getChildren() ) {
        for (let hitbox of dragon.getChild("Hitbox").getChildren()) {
          if ( !this.hitProcessed && Sup.ArcadePhysics2D.intersects(hitbox.arcadeBody2D, this.actor.getChild("Sprite").arcadeBody2D) ) {
            let isDead = hitbox.getBehavior(HitBehavior).processHit(this.power);
            dragon.getBehavior(DragonBehavior).checkDeathOnHit();
            Sup.log("Hit Dragon");
            this.hitProcessed = true;
          }
        }
      }
    }
    
  if (this.isAttacking && this.timer > 0) {
      // Animate weapon movement
      /let flip = this.actor.getChild("Sprite").spriteRenderer.getHorizontalFlip() ? -1 : 1;
      let fliprot = this.actor.getChild("Sprite").spriteRenderer.getHorizontalFlip() ? 180 : 0;
      switch(this.timer) {
        case 1:
        default:
          this.actor.getChild("Sprite").moveLocalX( -this.deltaX );
          this.actor.getChild("Sprite").moveLocalY( -this.deltaY );
          this.deltaX = 0; this.deltaY = 0;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(45 * flip));
          break;
          
        case 2:
          break;
          
        case 3:
          this.actor.getChild("Sprite").moveLocalX( -0.5 * flip );
          this.actor.getChild("Sprite").moveLocalY( -0.5 );
          this.deltaX += -0.5 * flip; this.deltaY += -0.5;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(-30 * flip));
          break;
        
        case 4:
          this.actor.getChild("Sprite").moveLocalX( 0.5 * flip );
          this.actor.getChild("Sprite").moveLocalY( -0.5 );
          this.deltaX += 0.5 * flip; this.deltaY += -0.5;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(0 * flip));
          break;
          
        case 5:
          this.actor.getChild("Sprite").moveLocalX( 1 * flip );
          this.actor.getChild("Sprite").moveLocalY( 0.5 );
          this.deltaX += 1 * flip; this.deltaY += 0.5;
          this.actor.getChild("Sprite").setLocalEulerZ(Sup.Math.toRadians(30 * flip));
          break;
          
        case 6:
          break;
      }*/
      this.timer--;
      if (this.timer <= 0) {
        this.isAttacking = false;
        this.hitProcessed = false;
      }
    }
  }
  
  attack() {
    this.isAttacking = true;
    this.timer = 6;
    this.hitProcessed = false;
  }
}
Sup.registerBehavior(WeaponBehavior);
