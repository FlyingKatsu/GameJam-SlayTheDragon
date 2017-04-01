class ItemBehavior extends Sup.Behavior {
  itemtype: number;
  
  /* An item is comprised of:
   * Parent actor (this) with an arcadeBody2D for detecting proximity to player via Collision2D
   * Label actor with a text renderer for showing item name when close to player
   * Sprite actor with a sprite renderer of animations and an arcadeBody2D for collisions with nearby objects/actors
  */
  
  private label: Sup.Actor;
  private sprite: Sup.Actor;
  
  private isEquipped;
  
  awake() {
    this.label = this.actor.getChild("Label");
    this.sprite = this.actor.getChild("Sprite");
    this.isEquipped = ( this.actor.getParent().getName() == "Player" );
  }

  update() {
    
  }
  
  // Handle transition from equipped to dropped
  
  // Dropped: yes movement; collide with tileset solids; label visibility based on player collision with near box
  onDropped():void {
    if (!this.isEquipped) return; // it's already dropped! do nothing.
    this.isEquipped = false;
  }
  
  // Equipped: no movement; follow player position on updates; no label visibility
  onEquipped():void {
    if (this.isEquipped) return; // it's already equipped! do nothing.
    this.isEquipped = true;
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
  }
  
}
Sup.registerBehavior(ItemBehavior);
