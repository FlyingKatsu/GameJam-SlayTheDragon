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
  
  awake() {
    this.label = this.actor.getChild("Label");
    this.sprite = this.actor.getChild("Sprite");
    this.groupActor = Sup.getActor(this.groupName);
    this.isEquipped = ( this.actor.getParent().getName() == "Player" );
    this.isFlipped = false;
  }

  update() {
    
    if (!this.isEquipped) {
      // Collide with solid tiles
      Sup.ArcadePhysics2D.collides( this.sprite.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
      // Parent should follow the sprite
      this.actor.arcadeBody2D.warpPosition(this.sprite.getPosition());
      
      // Check if nearbox collides with player
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, Sup.getActor("Player").arcadeBody2D) ) {
        // set visibility
        this.label.setVisible(true); 
        // TODO: add to nearby objects if not already
        
      } else {
        // no longer close to player so disable visibility
        this.label.setVisible(false);        
        // TODO: remove from nearby objects if not already
        
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
    this.actor.setName( this.name );
    
    // Set sprite movement
    this.sprite.arcadeBody2D.setMovable(true);
    // Set visibility
    this.label.setVisible(true);
    
    // Set local position
    //this.actor.setLocalX(0);
    //this.actor.setLocalY(0);
    
    // Set global position of sprite
    this.sprite.arcadeBody2D.warpPosition( Sup.getActor("Player").getPosition() );
    
    Sup.log("Dropped item! " + this.name);
  }
  
  // Equipped: no movement; follow player position on updates; no label visibility
  onEquipped():void {
    if (this.isEquipped) return; // it's already equipped! do nothing.
    this.isEquipped = true;
    
    // Reparent object to Player
    this.actor.setParent( Sup.getActor("Player") );
    // Rename object to Equipment
    this.actor.setName( "Equipment" );
    
    // Disable sprite movement
    this.sprite.arcadeBody2D.setMovable(false); 
    // Disable visibility
    this.label.setVisible(false);
    
    // Set local position
    //this.actor.setLocalX(this.heldPositionX);
    //this.actor.setLocalY(this.heldPositionY);
    Sup.log("Equipped item! " + this.name);
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
