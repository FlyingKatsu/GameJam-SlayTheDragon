module Game {
  
  export let MAX_VELOCITY_X: number = 0.8;
  export let MAX_VELOCITY_Y: number = 0.5;
  
  export let map: Sup.TileMap;
  export let playerActor: Sup.Actor;
        
  export let musicPlayer: Sup.Audio.SoundPlayer;
        
  /export let allSolidBodies: Sup.ArcadePhysics2D.Body[] = [];
  export let allPlatformBodies: Sup.ArcadePhysics2D.Body[] = [];
        
  export enum Direction { Up, Left, Down, Right };
  export enum Location { Top, Left, Bottom, Right };
  export let stringLocation: string[] = ["top", "left", "bottom", "right"];
  export let opposingLocation: string[] = ["bottom", "right", "top", "left"];
  
  export enum State { Init, Play, Done  };
  export let state: Game.State = Game.State.Init;
  
  export function init() {
    Game.state = Game.State.Init;
    
    // Play Music
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Keep/Music/Pyre", 0.25, { loop: true });
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
    Sup.loadScene("Keep/Scene");
    Game.playerActor = Sup.getActor("Player");
    
    // Set Gamestate
    Game.state = Game.State.Play; 
    
    // Set Gravity
    Sup.ArcadePhysics2D.setGravity(0, -0.02);
  }
  
}

Game.init();