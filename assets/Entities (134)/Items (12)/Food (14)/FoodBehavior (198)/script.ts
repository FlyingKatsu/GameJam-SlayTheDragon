class FoodBehavior extends Sup.Behavior {
  
  amount: number = 1;
  foodtype: string = "fruit";
  response: string = "Yum!"
  
  awake() {
    this.amount = Math.floor(Math.random() * 10) + 1;
    if (this.foodtype == "meat") this.amount += 100;
    
    this.actor.getChild("Label").textRenderer.setText(this.foodtype + "\n(+" + this.amount + " health)");
  }

  update() {
    
  }
  
  onUsed():string {
    // Add health amount
    Game.data.heart += this.amount;
    // Update HUD
    Game.updateHUD();
    
    return this.response;
  }
  
}
Sup.registerBehavior(FoodBehavior);
