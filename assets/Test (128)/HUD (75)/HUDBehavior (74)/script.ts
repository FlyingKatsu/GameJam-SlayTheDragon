class HUDBehavior extends Sup.Behavior {
  update() {
    let playerpos = Sup.getActor("Player").getPosition();
    this.actor.setX(playerpos.x);
    this.actor.setY(playerpos.y);
  }
}
Sup.registerBehavior(HUDBehavior);
