class SceneManagerBehavior extends Sup.Behavior {
  targetScene = "TestQun";
  
  update() {
    if ( Sup.Input.wasKeyJustPressed("SHIFT") ) {
      Sup.loadScene(this.targetScene);
    }
  }
}
Sup.registerBehavior(SceneManagerBehavior);
