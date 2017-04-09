class HeroBehavior extends Sup.Behavior {
  speed:number = 0.05;
  heroname: string = "";
  
  private equipment: Sup.Actor;
  private equipmentBehavior: ItemBehavior;
  
  private dialogue = { text: "Slay the Dragon!", timer: 240 };
  private alertedToGold: boolean = false;
  private underAttack: boolean = false;
  private itemTimer: number = 0;
  private attackedTimer: number = 0;
  private deathTimer: number = 0;
  
  private nearbyItems: Sup.Actor[] = [];
  private nearbyWeapons: Sup.Actor[] = [];
  private nearbyFood: Sup.Actor[] = [];
  private nearbyGold: Sup.Actor[] = [];
  private nearbyInteractives: Sup.Actor[] = [];
  
  awake() {
    this.equipment = this.actor.getChild("Equipment") || null;
    if (this.equipment != null) this.equipmentBehavior =  this.equipment.getBehavior(ItemBehavior) || null;
    
    this.heroname = this.heroname || this.generateName();
    
    if ( Game.data.hero > 1 ) this.actor.setName( "Hero" + Game.data.hero );
    
    this.updateMonitor( this.heroname + " joins you!", "Slay the Dragon!", 240 );
  }

  update() {
    
    if ( Game.state == Game.State.Play ) {
      
      // Update dialogue obj
      if ( this.dialogue.timer == 0 ) {
        this.actor.getChild("Dialogue").setVisible(false);
      } else {
        this.actor.getChild("Dialogue").setVisible(true);
        this.dialogue.timer--;
      }
      
      // Check collision with solid bodies (from tilemap)
      Sup.ArcadePhysics2D.collides( this.actor.arcadeBody2D, Sup.getActor("Map").arcadeBody2D );
      
      if ( this.deathTimer > 0 ) {
        
        // TODO: Death animation
        
        this.deathTimer--;
        
        if ( this.deathTimer <= 0 ) {
          // Update HUD and counter
          Game.data.kill++;
          Game.data.herodeath++;
          Game.updateHUD();
          
          // Kill this hero
          this.actor.destroy();
          
          // Summon new Hero
          Sup.getActor("HeroSpawner").getBehavior(HeroSpawnBehavior).spawn();
        }
        
      } else if ( this.attackedTimer > 0 ) {
        
        this.attackedTimer--;
        if (this.attackedTimer <= 0) {
          this.underAttack = false;
        }
        
      } else {
        // Handle behavior stuff
        let velocity = this.actor.arcadeBody2D.getVelocity();

        // Store nearby object status for quick access, if not airborne and not standing still, and not just swapped items
        if (velocity.x != 0 && velocity.y == 0 && this.itemTimer == 0) this.updateNearbyObjects();

        // Decide AI behavior
        velocity = this.decideAction(velocity);

        // Cap the velocity to avoid going crazy in falls
        velocity.x = Sup.Math.clamp(velocity.x, -Game.MAX_VELOCITY_X * 2/3, Game.MAX_VELOCITY_X * 2/3);
        velocity.y = Sup.Math.clamp(velocity.y, -Game.MAX_VELOCITY_Y/2, Game.MAX_VELOCITY_Y);

        // Finally, we apply the velocity back to the ArcadePhysics body
        this.actor.arcadeBody2D.setVelocity(velocity);
      }
      
      // Empty storage
      this.nearbyItems = [];
      this.nearbyWeapons = [];
      this.nearbyFood = [];
      this.nearbyGold = [];
      this.nearbyInteractives = [];
    }
    
  }
  
  killed(flipped: boolean) {
    // TODO: Death stuff
    this.deathTimer = 120;
    this.actor.arcadeBody2D.setVelocity(0,0);
    
    if (flipped) {
      this.actor.arcadeBody2D.warpPosition( this.actor.getX() - 1.5, this.actor.getY() + 1.0 );
    } else {
      this.actor.arcadeBody2D.warpPosition( this.actor.getX() + 1.5, this.actor.getY() + 1.0 );
    }
    
    // Drop weapon
    this.drop();
    
    this.updateMonitor( this.heroname + " was killed", "*dead*" );
    
    
  }
  
  attacked( flipped: boolean ) {
    this.underAttack = true;
    
    if (flipped) {
      this.actor.arcadeBody2D.warpPosition( this.actor.getX() - 1.5, this.actor.getY() + 1.0 );
    } else {
      this.actor.arcadeBody2D.warpPosition( this.actor.getX() + 1.5, this.actor.getY() + 1.0 );
    }
    
  }
  
  alertToGold() {
    this.alertedToGold = true;
  }
  
  private drop() {
    if (this.equipment != null) this.equipmentBehavior.onDropped();
    // Set our references to null
    this.equipment = null;
    this.equipmentBehavior = null;
  }
  
  private take(item:Sup.Actor) {
    this.equipment = item;
    this.equipmentBehavior = item.getBehavior(ItemBehavior);
    this.equipmentBehavior.onEquipped(this.actor);
  }
  
  private decideAction(velocity:Sup.Math.Vector2): Sup.Math.Vector2 {
    
    // If heard gold jingling, go towards it
    if ( this.alertedToGold ) {
      this.updateMonitor( this.heroname + " found gold!", "Gimme Gold!" );
    }
    // Else if under attack, fight back
    else if ( this.underAttack ) {
      this.updateMonitor( this.heroname + " got hurt!", "Ouch!");
      velocity.x = 0;
      this.attackedTimer = 60;
    }
    // Else if falling, do nothing
    else if ( velocity.y < 0 ) {
      //NOP
    }
    // Else, check for nearby objects
    else {
      
      if (this.itemTimer == 0) {
        // Get nearest object
        let {a, d} = this.getNearestObject();
        if ( a && d < Infinity && a != this.equipment ) {

          // Stop moving and pick it up!
          velocity.x = 0;
          this.itemTimer = 60;

          switch ( a.getBehavior(ItemBehavior).itemtype ) {
            case Game.Item.Weapon:
              this.drop();
              this.take(a);
              this.updateMonitor( this.heroname + " found a weapon!", "Mine!" );
              break;

            case Game.Item.Food:
              this.drop();
              this.take(a);
              this.updateMonitor( this.heroname + " found food!", "Looks tasty!" );
              break;

            case Game.Item.Gold:
              this.drop();
              this.take(a);
              this.updateMonitor( this.heroname + " found gold!", "Gimme Gold!" );
              break;

            default:
              break;
          }
        } else {
          // Default move to the right
         if (velocity.x == 0) velocity.x += this.speed; 
        }
      } else {
        // Decrement timer
        this.itemTimer--;
        // Default move to the right
        if (velocity.x == 0) velocity.x += this.speed; 
      }      
    }
    return velocity;
  }
  
  private updateNearbyObjects() {
    for ( let item of Sup.getActor("Weapons") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyWeapons.push(item);
        this.nearbyItems.push(item);
      }
    }
    for ( let item of Sup.getActor("Food") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyFood.push(item);
        this.nearbyItems.push(item);
      }
    }
    for ( let item of Sup.getActor("Gold") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyGold.push(item);
        this.nearbyItems.push(item);
      }
    }
    /*for ( let item of Sup.getActor("Interactive") .getChildren()) {
      if ( Sup.ArcadePhysics2D.intersects(this.actor.arcadeBody2D, item.arcadeBody2D) ) {
        this.nearbyInteractives.push(item);
        this.nearbyItems.push(item);
      }
    }*/
  }
  
  private getNearestObject() {
    let actor = this.actor;
    return this.nearbyItems.reduce( function(acc,item) {
      let distance = actor.getPosition().distanceTo(item.getPosition());
      // Make sure it is closest AND in front (not too far behind)
      let inFront = item.getX() - actor.getX();
      if (actor.spriteRenderer.getHorizontalFlip()) inFront = actor.getX() - item.getX();
      if (distance < acc.d && inFront > -0.5) return { a:item, d:distance }
      return acc;
    }, {a:this.actor,d:Infinity} );
  }
  
  private updateMonitor( action:string, response:string, timer:number=60 ):void {
    // Update dialogue
    this.dialogue.text = response;
    this.dialogue.timer = timer;
    if (this.actor.getChild("Dialogue") != null) this.actor.getChild("Dialogue").textRenderer.setText(this.dialogue.text);
    
    // Update monitor
    Game.data.herostatus.push("> " + action);
    Game.updateHeroMonitor();
  }
  
  private nameParts = {
    syllables: [ "n", "ra", "bo", "ta", "li", "p", "fa", "if" ],
    prefix: [ "Gre", "Stu", "Ha", "Ba", "Bo", "Ne", "Qu" ],
    suffix: [ "rry", "ly", "by", "er", "ance", "maru", "taro", "suke" ]
  };
  
  private generateName():string {
    let numSyllables = Math.floor(Math.random() * 3) + 1;
    let name = this.nameParts.prefix[ Math.floor(Math.random() * this.nameParts.prefix.length) ];
    for (let i = numSyllables; i >= 0; i--) name += this.nameParts.syllables[ Math.floor(Math.random() * this.nameParts.syllables.length) ];
    name += this.nameParts.suffix[ Math.floor(Math.random() * this.nameParts.suffix.length) ];
    return name;
  }
  
  
}
Sup.registerBehavior(HeroBehavior);
