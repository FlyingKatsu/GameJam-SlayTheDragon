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
  
  export enum State { Init, Play, Done  };
  export let state: Game.State = Game.State.Init;
        
  export enum Item { Weapon, Food, Gold };
  export enum Weapon { Sword, Axe, Spade, SquirtGun };
        
  export let data = {
    heart: 3,
    gold: 0,
    kill: 0,
    hero: 0,
    herostatus: ["> nothing to report...","",""],
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
      herostatus: ["nothing to report...","",""],
      dragon: "???"
    };
    
    // Reset Music
    if (Game.musicPlayer) Game.musicPlayer.stop();
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Music/Pyre", 0.25, { loop: true });
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
      HUD.getChild("DragonStatus").textRenderer.setText("Dragon Status: " + Game.data.hero);
    }
  }
  
  export function updateHeroMonitor() {
    let monitor = Sup.getActor("HeroMonitor");
    if (monitor) {
      let text = "";
      for (let i = 0; i < Game.data.herostatus.length; i++) {
        if (i > 2) { Game.data.herostatus.pop(); }
        else { text += "> " + Game.data.herostatus[i] + "\n";  }
      }
      monitor.getChild("Log").textRenderer.setText(text);
    }
  }
  
  export function endGame() {
    // Change music
    if (Game.musicPlayer) Game.musicPlayer.stop();
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Music/Pyre", 0.25, { loop: true });
    Game.musicPlayer.play();
    
    Sup.loadScene("Menu/Prefab");
    
    Game.state = Game.State.Done;
  }
  
}

Game.init();
