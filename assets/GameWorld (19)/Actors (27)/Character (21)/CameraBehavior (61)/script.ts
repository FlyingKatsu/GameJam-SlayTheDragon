class CameraBehavior extends Sup.Behavior {
  update() {
    let playerpos = Sup.getActor("Player").getPosition();
    Sup.getActor("PlayerCamera").setX(playerpos.x);
    Sup.getActor("PlayerCamera").setY(playerpos.y);
  }
}
Sup.registerBehavior(CameraBehavior);
