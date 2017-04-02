class ChestBehavior extends Sup.Behavior {
  contentGroup: string = "Gold";
  contents: string = "Coin";
  
  private item: Sup.Actor;
  
  awake() {
    let nameSplit = this.actor.getName().split(" ");
    if (nameSplit.length > 1) this.contents += nameSplit[1];
    let actor = Sup.getActor("Items").getChild(this.contentGroup).getChild(this.contents);
    if (actor) this.item = actor;
    Sup.log(actor);
  }

  update() {
    // Check collision with solid bodies (from tilemap)
    //Sup.ArcadePhysics2D.collides( this.actor.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
  }
  
  open() {
    this.actor.spriteRenderer.setAnimation("Open", false);
    this.item.arcadeBody2D.setEnabled(true);
  }
}
Sup.registerBehavior(ChestBehavior);
