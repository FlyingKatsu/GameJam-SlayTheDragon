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
      let flip = this.actor.getChild("Sprite").spriteRenderer.getHorizontalFlip() ? -1 : 1;
      switch(this.timer) {
        case 0:
        default:
          //this.actor.getChild("Sprite").rotateEulerZ(this.initialRot);
          //this.actor.getChild("Sprite").setLocalPosition(this.localPos);
          //this.actor.getChild("Sprite").rotateLocalEulerZ(5);
          this.actor.getChild("Sprite").moveLocalX( -this.deltaX );
          this.actor.getChild("Sprite").moveLocalY( -this.deltaY );
          //this.actor.getChild("Sprite").rotateEulerZ(35);
          this.deltaX = 0; this.deltaY = 0;
          break;
        case 1:
          //this.actor.getChild("Sprite").rotateLocalEulerZ(-5);
          this.actor.getChild("Sprite").moveLocalX( 0.5 * flip );
          this.actor.getChild("Sprite").moveLocalY( 0.25 * flip );
          this.deltaX += 0.5 * flip; this.deltaY += 0.25 * flip;
          break;
        case 2:
          this.actor.getChild("Sprite").moveLocalX( 0.5 * flip);
          this.actor.getChild("Sprite").moveLocalY( 0.25 * flip);
          this.deltaX += 0.5 * flip; this.deltaY += 0.25 * flip;
          break;
        case 3:
          //this.actor.getChild("Sprite").rotateLocalEulerZ(-35);
          break;
      }
      this.timer--;
    }
  }
  
  attack() {
    this.isAttacking = true;
    this.timer = 3;
  }
}
Sup.registerBehavior(WeaponBehavior);
