//Sup.ArcadePhysics2D.setGravity(0, -0.02);

class PlayerBehavior extends Sup.Behavior {
  speed:number = 0.2;
  jumpSpeed:number = 0.42;
  
  private initialSize;
  private initialOffset;
  private allPlatformBodies: Sup.ArcadePhysics2D.Body[] = [];
  
  private controls;
  private equipment;
  
  awake() {
    this.initialSize = this.actor.arcadeBody2D.getSize();
    this.initialOffset = this.actor.arcadeBody2D.getOffset();
    
    // Platform bodies
    let platformBodies = Sup.getActor("Platforms").getChildren();
    for (let platBody of platformBodies) this.allPlatformBodies.push(platBody.arcadeBody2D);
    
    // Equipment
    let equipment = this.actor.getChild("Equipment");
    
    // Init controls obj
    this.controls = {
      pressed: {
        left: false,
        right: false,
        jump: false,
        down: false,
        swap: false,
        use: false
      },
      held: {
        left: false,
        right: false,
        jump: false,
        down: false,
        swap: false,
        use: false
      }
    };
  }
  
  update() {
    
    // Store controls status so we only have to reduce N per update
    this.updateControls();
    
    // Handle interactions with items
    this.processItems();
    
    // Handle solid body collisions
    let {touchSolids, velocity, dampenFall, touchPlatforms } = this.updateSolidCollisions() ;
    
    // Process player input for movement controls
    
    // We override the `.x` component based on the player's input
    if ( this.controls.held.left ) {
      velocity.x = -this.speed;
      // When going left, we flip the sprite
      this.actor.spriteRenderer.setHorizontalFlip(true);
    } else if ( this.controls.held.right ) {
      velocity.x = this.speed;
      // When going right, we clear the flip
      this.actor.spriteRenderer.setHorizontalFlip(false);
    } else velocity.x = 0;

    // If the player is on the ground and wants to jump,
    // we update the `.y` component accordingly
    let touchBottom = touchSolids || touchPlatforms;
    if (touchBottom) {
      if ( this.controls.pressed.jump ) {
        velocity.y = this.jumpSpeed;
        this.actor.spriteRenderer.setAnimation("Jump");
      // If isKeyDown("DOWN") and touchPlatforms to drop down from platform
      } else if ( this.controls.pressed.down && touchPlatforms ) {
        velocity.y = -this.speed;
      } else {
        // Here, we should play either "Idle" or "Run" depending on the horizontal speed
        if (velocity.x === 0) this.actor.spriteRenderer.setAnimation("Idle");
        else this.actor.spriteRenderer.setAnimation("Move");
      }
    } else {
      // Here, we should play either "Jump" or "Fall" depending on the vertical speed
      if (velocity.y >= 0) { 
        this.actor.spriteRenderer.setAnimation("Jump");
      } else {
        this.actor.spriteRenderer.setAnimation("Fall");
        // If isKeyDown("DOWN") to add extra umph to the fall
        if ( this.controls.held.down ) {
          velocity.y = -Game.MAX_VELOCITY_Y;
          dampenFall = false;
        }
      } 
    }
    
    // Cap the velocity to avoid going crazy in falls
    velocity.x = Sup.Math.clamp(velocity.x, -Game.MAX_VELOCITY_X, Game.MAX_VELOCITY_X);
    if (dampenFall) velocity.y = Sup.Math.clamp(velocity.y, -Game.MAX_VELOCITY_Y/2, Game.MAX_VELOCITY_Y);
    
    // Finally, we apply the velocity back to the ArcadePhysics body
    this.actor.arcadeBody2D.setVelocity(velocity);
  }
  
  
  // Helper functions
  
  private updateControls() {
    // Just Pressed
    this.controls.pressed.left = Controls.pressed("moveLeft");
    this.controls.pressed.right = Controls.pressed("moveRight");
    this.controls.pressed.jump = Controls.pressed("jump");
    this.controls.pressed.down = Controls.pressed("moveDown");
    this.controls.pressed.swap = Controls.pressed("swap");
    this.controls.pressed.use = Controls.pressed("use");
    // Held
    this.controls.held.left = Controls.held("moveLeft");
    this.controls.held.right = Controls.held("moveRight");
    this.controls.held.jump = Controls.held("jump");
    this.controls.held.down = Controls.held("moveDown");
    this.controls.held.swap = Controls.held("swap");
    this.controls.held.use = Controls.held("use");
  }
  
  private processItems() {
    if ( this.controls.pressed.swap ) Sup.log("Swapped item!");
    if ( this.controls.pressed.use ) Sup.log("Used item!");
    
    // Check item actions
    
    if ( this.controls.pressed.use && this.equipment ) {
      // Handle interactions
      switch ( this.equipment.getBehavior(ItemBehavior).itemtype ) {
        case Game.Item.Weapon:
          if (Game.nearbyInteractives.length == 0) {
            // TODO: Play default animation and sfx
          } else {
            // Handle differently based on weapon type
            switch( this.equipment.getBehavior(WeaponBehavior).itemtype) {
              case Game.Weapon.Axe:
                // TODO: Check for treetrunk | chest in nearbyInteractives
                break;
                
              case Game.Weapon.Spade:
                // TODO: Check for dirt | chest in nearbyInteractives
                break;
                
              case Game.Weapon.SquirtGun:
                // TODO: Check for fruitspawner | chest in nearbyInteractives
                break;
                
              case Game.Weapon.Sword:
              default:
                // TODO: Check for fruitspawner | chest in nearbyInteractives
                break;
            }
          }
          break;

        case Game.Item.Food:
          // TODO: Play animation and sfx
          // TODO: Restore health
          break;

        case Game.Item.Gold:
          // TODO: Play animation and sfx
          // TODO: Attract nearby NPC or Dragon
          break;

        default:
          break;
      }  
    } 
  }
  
  private updateSolidCollisions() {
    // Check collision with solid bodies (from tilemap)
    Sup.ArcadePhysics2D.collides( this.actor.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
    
    let touchSolids = this.actor.arcadeBody2D.getTouches().bottom;
    let velocity = this.actor.arcadeBody2D.getVelocity();
    let dampenFall = true;
    
    // If falling, check the semi-solid bodies
    let touchPlatforms = false;
    if ( velocity.y < 0 ) {
      // TODO: apply custom collision here so we can drop down
      for (let platformBody of this.allPlatformBodies) {
        Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, platformBody);
        if (this.actor.arcadeBody2D.getTouches().bottom) {
          touchPlatforms = true;
          velocity.y = 0;
          break;
        }
      }
    }
    
    return {touchSolids, velocity, dampenFall, touchPlatforms};
  }
  
}
Sup.registerBehavior(PlayerBehavior);
