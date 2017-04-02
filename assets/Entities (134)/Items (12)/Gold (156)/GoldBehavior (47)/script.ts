class GoldBehavior extends Sup.Behavior {
  
  amount: number = 1;
  
  awake() {
    this.amount = Math.floor(Math.random() * 50) + 10;
    this.actor.getChild("Label").textRenderer.setText(this.amount + " gold");
  }

  update() {
    
  }
  
  onDropped() {
    // Drop gold with amount from Game.data and set Game.data to 0
    this.amount = Game.data.gold;
    this.actor.getChild("Label").textRenderer.setText(this.amount + " gold");
    Game.data.gold = 0;
    Game.updateHUD();
  }
  
}
Sup.registerBehavior(GoldBehavior);
