class ButtonBehavior extends Sup.Behavior {
  targetScene = "TestQun";
  hovered = false;
  
  update() {
    
    let mouseClicked = Sup.Input.wasMouseButtonJustPressed(0);
    let mouseMoved = Sup.Input.getMouseDelta().length() > 0;
    
    if (mouseClicked || mouseMoved) {
      // Check for mouse intersection with activeButton
      let ray = new Sup.Math.Ray();
      ray.setFromCamera(this.actor.getParent().camera, Sup.Input.getMousePosition());
      let hit = ray.intersectActor(this.actor);

      if (hit) {
        // Handle click and hover separately
        if (mouseClicked) {
          Sup.loadScene(this.targetScene);
        } else {
          this.hovered = true;
          this.actor.spriteRenderer.setAnimation("hovered");
        }
      }
    
    } else {
      // Check if we should detect a Mouse no longer hovering
      if (this.hovered) {
        this.hovered = false;
        this.actor.spriteRenderer.setAnimation("normal");
      }
    }
    
  }
}
Sup.registerBehavior(ButtonBehavior);
