//Sup.ArcadePhysics2D.setGravity(0, -0.02);

class PlayerBehavior extends Sup.Behavior {
  speed:number = 0.2;
  jumpSpeed:number = 0.42;
  
  private initialSize;
  private initialOffset;
  
  private controls;
  private equipment: Sup.Actor;
  private equipmentBehavior: ItemBehavior;
  
  private nearbyItems: Sup.Actor[] = [];
  private nearbyWeapons: Sup.Actor[] = [];
  private nearbyFood: Sup.Actor[] = [];
  private nearbyGold: Sup.Actor[] = [];
  private nearbyInteractives: Sup.Actor[] = [];
  
  private dropFromPlatform: boolean = false;
  
  private dialogue = { text: "", timer: 0 };
  
  
  awake() {
    this.initialSize = this.actor.arcadeBody2D.getSize();
    this.initialOffset = this.actor.arcadeBody2D.getOffset();
    
    // Platform bodies
    let platformBodies = Sup.getActor("Platforms").getChildren();
    for (let platBody of platformBodies) Game.allPlatformBodies.push(platBody.arcadeBody2D);
    
    // Equipment
    this.equipment = this.actor.getChild("Equipment");
    this.equipmentBehavior =  this.equipment.getBehavior(ItemBehavior);
    
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
    // Debug endings
    if ( Sup.Input.wasKeyJustPressed("P") ) Game.data.dragon = "Dead";
    if ( Sup.Input.wasKeyJustPressed("R") ) Game.endGame(false);
    if ( Sup.Input.wasKeyJustPressed("T") ) Game.endGame(true);
    
    // End game if dead
    if ( Game.data.heart <= 0 ) Game.endGame(false);
    
    if (Game.state == Game.State.Play) {
      
      // Update dialogue obj
      if ( this.dialogue.timer == 0 ) {
        this.actor.getChild("Dialogue").setVisible(false);
      } else {
        this.actor.getChild("Dialogue").setVisible(true);
        this.dialogue.timer--;
      }

      // Store controls status so we only have to reduce N per update
      this.updateControls();

      // Store nearby object status for quick access
      if (this.controls.pressed.swap || this.controls.pressed.use) this.updateNearbyObjects();

      // Handle interactions with items    
      this.processUseItem();
      this.processSwapItem();

      // Handle solid body collisions
      let {touchSolids, velocity, dampenFall, touchPlatforms } = this.updateSolidCollisions() ;

      // Process player input for movement controls

      // We override the `.x` component based on the player's input
      if ( this.controls.held.left ) {
        velocity.x = -this.speed;
        // When going left, we flip the sprite=
        this.setFlip(true);
      } else if ( this.controls.held.right ) {
        velocity.x = this.speed;
        // When going right, we clear the flip
        this.setFlip(false);
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
          this.dropFromPlatform = true;
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

      // Empty storage
      this.nearbyItems = [];
      this.nearbyWeapons = [];
      this.nearbyFood = [];
      this.nearbyGold = [];
      this.nearbyInteractives = [];
    }
  }
  
  
  // Helper functions
  private setFlip( v:boolean ):void {
    // If we aren't flipped yet, flip the equipment as well
    if ( this.equipmentBehavior && this.actor.spriteRenderer.getHorizontalFlip() != v ) this.equipmentBehavior.flip();
    // Set whether or not we are flipped
    this.actor.spriteRenderer.setHorizontalFlip(v);
  }
  
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
  
  private updateNearbyObjects() {
    for ( let item of Sup.getActor("Weapons") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyWeapons.push(item);
        this.nearbyItems.push(item);
      }
    }
    for ( let item of Sup.getActor("Food") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyFood.push(item);
        this.nearbyItems.push(item);
      }
    }
    for ( let item of Sup.getActor("Gold") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyGold.push(item);
        this.nearbyItems.push(item);
      }
    }
    for ( let item of Sup.getActor("Interactive") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyInteractives.push(item);
        //this.nearbyItems.push(item);
      }
    }
  }
  
  private getNearestObject() {
    let actor = this.actor;
    return this.nearbyItems.reduce( function(acc,item) {
      let distance = actor.getPosition().distanceTo(item.getPosition());
      // Make sure it is closest AND in front (not too far behind)
      let inFront = item.getX() - actor.getX();
      if (actor.spriteRenderer.getHorizontalFlip()) inFront * -1;
      if (distance < acc.d && inFront > -1) return { a:item, d:distance }
      return acc;
    }, {a:this.actor,d:Infinity} );
  }
  
  private getNearestInteractive() {
    let actor = this.actor;
    return this.nearbyInteractives.reduce( function(acc,item) {
      let distance = actor.getPosition().distanceTo(item.getPosition());
      // Make sure it is closest AND in front (not too far behind)
      let inFront = item.getX() - actor.getX();
      if (actor.spriteRenderer.getHorizontalFlip()) inFront * -1;
      if (distance < acc.d && inFront > -1) return { a:item, d:distance }
      return acc;
    }, {a:this.actor,d:Infinity} );
  }
  
  private processSwapItem() {
    // If user is using an item, don't do anything here!
    if ( this.controls.held.use && this.equipment ) return;
    if ( !this.controls.pressed.swap ) return;
    
    // If user is near an item,
    if ( this.nearbyItems.length > 0 ) {
      
      // Get closest object
      let {a, d} = this.getNearestObject();
      
      // If current is gold, check if we should increment or drop
      if ( this.equipmentBehavior && this.equipmentBehavior.itemtype == Game.Item.Gold) {
        
        // If nearest is also gold: don't swap, just increment and destroy
        if ( a.getBehavior(ItemBehavior).itemtype == Game.Item.Gold ) { 
          // Add gold amount
          Game.data.gold += a.getBehavior(GoldBehavior).amount;
          // Update HUD
          Game.updateHUD();
          // Destroy other gold
          a.destroy();
          
          // End
          return;
        } else { // Drop gold with amount from Game.data and set Game.data to 0
          this.equipment.getBehavior(GoldBehavior).onDropped();
        }
      }
      
      // Swap
      if ( this.equipmentBehavior ) this.equipmentBehavior.onDropped(); // Drop current equipment
        
      // Pick up closest object
      if (a && d < Infinity && a != this.equipment) {
        
        // If it's gold, increment Game.data.gold
        if ( a.getBehavior(ItemBehavior).itemtype == Game.Item.Gold ) { 
          // Add gold amount
          Game.data.gold += a.getBehavior(GoldBehavior).amount;
          // Update HUD
          Game.updateHUD();
        }        
        this.equipment = a;
        this.equipmentBehavior = a.getBehavior(ItemBehavior);
        this.equipmentBehavior.onEquipped(this.actor);
      }
      
    } else {
      // Otherwise just drop it, assuming we have an item
      if ( this.equipment ) {
        
        if ( this.equipmentBehavior.itemtype == Game.Item.Gold ) {
          // Drop gold with amount from Game.data and set Game.data to 0
          this.equipment.getBehavior(GoldBehavior).onDropped();
        }
        
        // Drop it
        this.equipmentBehavior.onDropped();
        // Set our references to null
        this.equipment = null;
        this.equipmentBehavior = null;
      }
    }
  }
  
  private processUseItem() {
    if ( this.controls.pressed.use ) Sup.log("Used item!");
    
    // Check item actions
    
    if ( this.controls.pressed.use && this.equipment ) {
      // Handle interactions
      switch ( this.equipmentBehavior.itemtype ) {
        case Game.Item.Weapon:
          if (this.nearbyInteractives.length == 0) {
            // TODO: Play default animation and sfx
            this.equipment.getBehavior(WeaponBehavior).attack();
            // Say TAKE THIS!
            this.dialogue.text = "Take THIS! HAH!";
            this.dialogue.timer = 60;
            this.actor.getChild("Dialogue").textRenderer.setText(this.dialogue.text);
          } /else {
            // Get nearest Interactive
            let {a, d} = this.getNearestInteractive();
            if ( a != this.actor && d < Infinity && a.getBehavior(ChestBehavior) ) {
              // If it's a treasure chest, open it!
              a.getBehavior(ChestBehavior).open();
              // Say TREASURE!
              this.dialogue.text = "Ooh, TREASURE!";
              this.dialogue.timer = 60;
              this.actor.getChild("Dialogue").textRenderer.setText(this.dialogue.text);
            } else {
              // Handle differently based on weapon type and interactive
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
            }
            break;

        case Game.Item.Food:
          // TODO: Play animation and sfx

          let response = this.equipment.getBehavior(FoodBehavior).onUsed();

          // Say yum
          this.dialogue.text = response;
          this.dialogue.timer = 60;
          this.actor.getChild("Dialogue").textRenderer.setText(this.dialogue.text);

          // Destroy the item
          this.equipment.destroy();

          // Set our references to null
          this.equipment = null;
          this.equipmentBehavior = null;

          break;

        case Game.Item.Gold:
          // TODO: Play animation and sfx
          // TODO: Attract nearby NPC or Dragon
          // Say Ka-Ching
          this.dialogue.text = "It's Shiny!";
          this.dialogue.timer = 60;
          this.actor.getChild("Dialogue").textRenderer.setText(this.dialogue.text);
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
    let intersectsPlatform = false;
    
    // If falling, check the semi-solid bodies
    let touchPlatforms = false;
    if ( velocity.y < 0 ) {
      
      if (this.dropFromPlatform) {
        for (let platformBody of Game.allPlatformBodies) {
          if (Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, platformBody)) {
           intersectsPlatform = true;
          }
        }
      } else {
        for (let platformBody of Game.allPlatformBodies) {
          Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, platformBody);
          if (this.actor.arcadeBody2D.getTouches().bottom) {
            touchPlatforms = true;
            velocity.y = 0;
            break;
          }
        }
      }
      
    }
    
    if (!intersectsPlatform && this.dropFromPlatform) this.dropFromPlatform = false;
    
    return {touchSolids, velocity, dampenFall, touchPlatforms};
  }
  
}
Sup.registerBehavior(PlayerBehavior);
