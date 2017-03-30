class FakePlayerBehavior extends Sup.Behavior {
  speed = 0.2;
  jumpSpeed = 0.4;

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Mapper").arcadeBody2D);

    // As explained above, we get the current velocity
    let velocity = this.actor.arcadeBody2D.getVelocity();

    // We override the `.x` component based on the player's input
    if (Sup.Input.isKeyDown("LEFT") || Sup.Input.isKeyDown("A")) {
      velocity.x = -this.speed;
      // When going left, we flip the sprite
      this.actor.spriteRenderer.setHorizontalFlip(true);
    } else if (Sup.Input.isKeyDown("RIGHT") || Sup.Input.isKeyDown("D")) {
      velocity.x = this.speed;
      // When going right, we clear the flip
      this.actor.spriteRenderer.setHorizontalFlip(false);
    } else velocity.x = 0;

    // If the player is on the ground and wants to jump,
    // we update the `.y` component accordingly
    let touchBottom = this.actor.arcadeBody2D.getTouches().bottom;
    if (touchBottom) {
      if (Sup.Input.isKeyDown("UP") || Sup.Input.isKeyDown("W") || Sup.Input.isKeyDown("SPACE")) {
        velocity.y = this.jumpSpeed;
        this.actor.spriteRenderer.setAnimation("Jump");
      } else if ( Sup.Input.isKeyDown("DOWN") || Sup.Input.isKeyDown("S") ) {
        velocity.y = -this.jumpSpeed;
        this.actor.spriteRenderer.setAnimation("Fall");
      } else {
        // Here, we should play either "Idle" or "Run" depending on the horizontal speed
        if (velocity.x === 0) this.actor.spriteRenderer.setAnimation("Idle");
        else this.actor.spriteRenderer.setAnimation("Move");
      }
    } else {
      // Here, we should play either "Jump" or "Fall" depending on the vertical speed
      if (velocity.y >= 0) this.actor.spriteRenderer.setAnimation("Jump");
      else this.actor.spriteRenderer.setAnimation("Fall");
    }

    // Finally, we apply the velocity back to the ArcadePhysics body
    this.actor.arcadeBody2D.setVelocity(velocity);
  }
}
Sup.registerBehavior(FakePlayerBehavior);
