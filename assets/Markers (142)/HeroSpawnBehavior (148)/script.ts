class HeroSpawnBehavior extends Sup.Behavior {
  
  awake() {
    
  }

  update() {
    
  }
  
  
  spawn() {
    // TODO: Instead of appendScene, create new actor and set the prefab
    let newHero = new Sup.Actor( "Hero" + Game.data.hero, Sup.getActor("Heroes") );
    
    let spriteRenderer = new Sup.SpriteRenderer(newHero);
    spriteRenderer.setSprite("Entities/Actors/Player/Sprite");
    spriteRenderer.setAnimation("HeroIdle", true);
    
    let arcadeBody2D = new Sup.ArcadePhysics2D.Body( newHero, Sup.ArcadePhysics2D.BodyType.Box, 
    {
      movable: true,
      width: 1.4,
      height: 2.1,
      offset: { x: -0.1, y: -0.15 },
      bounce: { x:0, y: 0 }
    } );
    
    // TODO: Add Equipment
    
    
    // Add Dialogue
    let dialogue = new Sup.Actor( "Dialogue", newHero );
    let textRenderer = new Sup.TextRenderer( dialogue, "Slay the Dragon!", "Entities/Items/Font" );
    dialogue.setLocalY(2.2);
    
    let dialogueBG =  new Sup.Actor( "DialogueBG", dialogue );
    let spriteRenderer2 = new Sup.SpriteRenderer(dialogueBG);
    spriteRenderer2.setSprite("Entities/Items/ItemBG");
    dialogueBG.setLocalZ(-1);
    
    // Add behaviors
    newHero.addBehavior(HeroBehavior);
    newHero.addBehavior(HitBehavior);
    newHero.getBehavior(HitBehavior).defense = 3;
    
    // Position at spawn point and update HUD
    newHero.arcadeBody2D.warpPosition( this.actor.getPosition() );
    Game.data.hero++;
    Game.updateHUD();
  }
  
}
Sup.registerBehavior(HeroSpawnBehavior);
