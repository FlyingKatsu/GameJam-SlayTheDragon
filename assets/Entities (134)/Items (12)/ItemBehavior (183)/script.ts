class ItemBehavior extends Sup.Behavior {
  itemtype: number = 0;
  groupName: string = "Weapons";
  name: string = "Sword";
  heldPositionX: number = 0;
  heldPositionY: number = 0;
  
  /* An item is comprised of:
   * Parent actor (this) with an arcadeBody2D for detecting proximity to player via Collision2D
   * Label actor with a text renderer for showing item name when close to player
   * Sprite actor with a sprite renderer of animations and an arcadeBody2D for collisions with nearby objects/actors
  */
  
  private label: Sup.Actor;
  private sprite: Sup.Actor;
  private groupActor: Sup.Actor;
  
  private isEquipped: boolean;
  private isFlipped: boolean;
  
  private owner: Sup.Actor;
  
  awake() {
    this.label = this.actor.getChild("Label");
    this.sprite = this.actor.getChild("Sprite");
    this.groupActor = Sup.getActor(this.groupName);
    this.isEquipped = ( this.actor.getParent().getName() == "Player" || this.actor.getParent().getName() == "Hero" );
    this.isFlipped = false;
    
    if (!this.isEquipped) {
      // Set sprite to be movable, but not the parent
      this.sprite.arcadeBody2D.setMovable(true);
      this.actor.arcadeBody2D.setMovable(false);
    } else {
      this.owner = this.actor.getParent();
    }
  }

  update() {
    
    if (!this.isEquipped) {
      // Collide with solid tiles
      Sup.ArcadePhysics2D.collides( this.sprite.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
      // Collide with platforms
      Sup.ArcadePhysics2D.collides( this.sprite.arcadeBody2D, Game.allPlatformBodies );
      // Parent should follow the sprite
      this.actor.arcadeBody2D.warpPosition(this.sprite.getPosition());
      
      // Check if nearbox collides with player
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, Sup.getActor("Player").arcadeBody2D) ) {
        // set visibility
        this.label.setVisible(true); 
        
      } else {
        // no longer close to player so disable visibility
        this.label.setVisible(false); 
        
      }
    }
    
  }
  
  // Handle transition from equipped to dropped
  
  // Dropped: yes movement; collide with tileset solids; label visibility based on player collision with near box
  onDropped():void {
    if (!this.isEquipped) return; // it's already dropped! do nothing.
    this.isEquipped = false;
    
    // Reparent object to Items actor in appropriate child
    this.actor.setParent( this.groupActor );
    // Rename object to what it is
    this.actor.setName( this.name + this.groupActor.getChildren().length );
    
    // Set sprite movement
    this.sprite.arcadeBody2D.setMovable(true);
    // Set visibility
    this.label.setVisible(true);
    
    // Set local position
    this.actor.setLocalX(0);
    this.actor.setLocalY(0);
    this.actor.setLocalZ(0);
    
    // Set global position of sprite
    this.sprite.arcadeBody2D.warpPosition( this.owner.getPosition() );
    
    this.owner = null;
    //Sup.log("Dropped item! " + this.actor.getName());
  }
  
  // Equipped: no movement; follow player position on updates; no label visibility
  onEquipped(owner:Sup.Actor):void {
    if (this.isEquipped) return; // it's already equipped! do nothing.
    this.isEquipped = true;
    
    this.owner = owner;
    
    // Reparent object to owner
    this.actor.setParent( owner );
    // Rename object to Equipment
    this.actor.setName( "Equipment" );
    
    // Disable sprite movement
    this.sprite.arcadeBody2D.setMovable(false); 
    // Disable visibility
    this.label.setVisible(false);
    
    // Set local position
    this.actor.setLocalX(this.heldPositionX);
    this.actor.setLocalY(this.heldPositionY);
    this.actor.setLocalZ(1); // In front of owner
    
    // Re-adjust position if flipped
    if (this.isFlipped) this.actor.setLocalX(-1 * this.heldPositionX);
    
    // Set flip according to owner
    if (owner.spriteRenderer.getHorizontalFlip() != this.isFlipped) this.flip();
    
    //Sup.log("Equipped item! " + this.actor.getName());
  }
  
  // When player changes directions, so should this item, if it's equipped
  flip():void {
    if (!this.isEquipped) return; // it's not equipped! do nothing.
    // Flip sprite
    this.sprite.spriteRenderer.setHorizontalFlip(!this.sprite.spriteRenderer.getHorizontalFlip());
    // Flip sprite rotation
    this.sprite.setLocalEulerZ( this.sprite.getLocalEulerZ() * -1 );
    // Adjust actor position
    this.actor.setLocalPosition( { x: (-1 * this.actor.getLocalX()), y: this.actor.getLocalY() } );
    
    this.isFlipped = !this.isFlipped;
  }
  
}
Sup.registerBehavior(ItemBehavior);
