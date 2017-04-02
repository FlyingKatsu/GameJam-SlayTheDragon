module Game {
  
  export let MAX_VELOCITY_X: number = 0.8;
  export let MAX_VELOCITY_Y: number = 0.5;
  
  export let map: Sup.TileMap;
  export let playerActor: Sup.Actor;
        
  export let musicPlayer: Sup.Audio.SoundPlayer;
        
  //export let allSolidBodies: Sup.ArcadePhysics2D.Body[] = [];
  //export let allPlatformBodies: Sup.ArcadePhysics2D.Body[] = [];
  export let allPlatformBodies: Sup.ArcadePhysics2D.Body[] = [];
        
  export enum Direction { Up, Left, Down, Right };
  export enum Location { Top, Left, Bottom, Right };
  export let stringLocation: string[] = ["top", "left", "bottom", "right"];
  export let opposingLocation: string[] = ["bottom", "right", "top", "left"];
  
  export enum State { Init, Play, OnHold, Done  };
  export let state: Game.State = Game.State.Init;
        
  export enum Item { Weapon, Food, Gold };
  export enum Weapon { Sword, Axe, Spade, SquirtGun };
        
  export let data = {
    heart: 3,
    gold: 0,
    kill: 0,
    hero: 0,
    herostatus: ["> You fell into a cave!"],
    dragon: "???"
  };
  
  export function init() {
    Game.state = Game.State.Init;
    
    // Reset data
    data = {
      heart: 3,
      gold: 0,
      kill: 0,
      hero: 0,
      herostatus: ["> You fell into a cave!"],
      dragon: "???"
    };
    
    // Reset Music
    if (Game.musicPlayer) Game.musicPlayer.stop();
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Music/TaintedOverworld", 0.25, { loop: true });
    musicPlayer.play();
    
    // NOTE: this only works if the scene is loaded, but for some reason not in a timeout callback
    // Store solid bodies in a list separate from semi-solid bodies
    //let platformBodies = Sup.getActor("Platforms").getChildren();
      //for (let platBody of platformBodies) this.allPlatformBodies.push(platBody.arcadeBody2D);
    //let solidBodies = Sup.getActor("Solids").getChildren();
      //for (let solidBody of solidBodies) this.allSolidBodies.push(solidBody.arcadeBody2D);
    
    Sup.setTimeout(1000, startGame);
  }
  
  export function startGame() {
    // NOTE:  Behavior classes won't be recognized at runtime unless this script is the very last in the hierarchy
    // Load scene
    Sup.loadScene("Scene");
    Game.playerActor = Sup.getActor("Player");
    
    // Set Gamestate
    Game.state = Game.State.Play; 
    
    // Set Gravity
    Sup.ArcadePhysics2D.setGravity(0, -0.02);
  }
  
  export function updateHUD() {
    let HUD = Sup.getActor("HUD");
    if (HUD) {
      HUD.getChild("HeartCount").textRenderer.setText("Health: " + Game.data.heart);
      HUD.getChild("GoldCount").textRenderer.setText("Gold: " + Game.data.gold);
      HUD.getChild("KillCount").textRenderer.setText("Kills: " + Game.data.kill);
      HUD.getChild("DeathCount").textRenderer.setText("Hero Count: " + Sup.getActor("Heroes").getChildren().length + "/" + Game.data.hero);
      HUD.getChild("DragonStatus").textRenderer.setText("Dragon Status: " + Game.data.dragon);
    }
  }
  
  export function updateHeroMonitor() {
    let monitor = Sup.getActor("HeroMonitor");
    if (monitor) {
      if (Game.data.herostatus.length > 3) {
        Game.data.herostatus.reverse(); // flip around so we can pop
        for ( let i = 0; i < Game.data.herostatus.length - 3; i++ ) Game.data.herostatus.pop();
        Game.data.herostatus.reverse(); // flip around to regain order
      }
      let text = Game.data.herostatus.join("\n");
      monitor.getChild("Log").textRenderer.setText(text);
    }
  }
  
  export function endGame(gameWon: boolean) {
    let scene = gameWon ? "Menu/PrefabWin" : "Menu/PrefabLose";
    
    // Change music
    if (Game.musicPlayer) Game.musicPlayer.stop();
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Music/Pyre", 0.25, { loop: true });
    Game.musicPlayer.play();
    
    // Change to Menu scene
    Sup.loadScene(scene);
    let text = Sup.getActor("Status").textRenderer.getText();
    
    if (gameWon) {
      if (Game.data.dragon == "Dead") {
        text = "You slayed the dragon. Nice work.\nBut you're still stuck in the cave...";
        Sup.getActor("Restart").textRenderer.setText("Press SPACEBAR to try again");
      }
      if (Game.data.kill > Game.data.hero / 5) text += "\nYou really love slaying, don't you?";
      if (Game.data.gold > 500) text += "\nWhat will you do with all that gold?";
    } else {
      if (Game.data.kill > Game.data.hero / 5) text += "\nDo you prefer dragons over people?";
      if (Game.data.gold > 500) text += "\nWhat will you do with all that gold?";
    }
    Sup.getActor("Status").textRenderer.setText(text);
    Game.state = Game.State.Done;
    return;
  }
  
  export function endGame2(gameWon: boolean) {
    //let tune = gameWon ? "Music/Pyre" : "Music/Pyre";
    let scene = gameWon ? "Menu/PrefabWin" : "Menu/PrefabLose";
    
    // Change music
    if (Game.musicPlayer) Game.musicPlayer.stop();
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Music/Pyre", 0.25, { loop: true });
    Game.musicPlayer.play();
    
    if (gameWon) {
      // Add Menu screen to scene
      Sup.appendScene(scene);
      let text = Sup.getActor("Status").textRenderer.getText();
      
      if (Game.data.dragon == "Dead") {
        text = "You slayed the dragon. Nice work.\nBut you're still stuck in the cave...";
        Sup.getActor("Restart").textRenderer.setText("Press SPACEBAR to try again");
      }
      
      if (Game.data.kill > Game.data.hero / 5) text += "\nYou really love slaying, don't you?";
      if (Game.data.gold > 500) text += "\nWhat will you do with all that gold?";
      
      Game.state = Game.State.OnHold;
      Sup.getActor("Status").textRenderer.setText(text);
    } else {
      // Change to Menu scene
      Sup.loadScene(scene);
      let text = Sup.getActor("Status").textRenderer.getText();
      
      if (Game.data.kill > Game.data.hero / 5) text += "\nDo you prefer dragons over people?";
      if (Game.data.gold > 500) text += "\nWhat will you do with all that gold?";
      
      Game.state = Game.State.Done;
      Sup.getActor("Status").textRenderer.setText(text);
    }    
  }
  
  export function continueGame() {
    Sup.getActor("EndScene").destroy();
    Sup.ArcadePhysics2D.setGravity(0, -0.02);
    Game.state = Game.State.Play;
  }
  
}

Game.init();
