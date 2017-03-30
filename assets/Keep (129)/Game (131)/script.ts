module Game {
  
  export let map: Sup.TileMap;
  export let playerActor: Sup.Actor;
        
  export let musicPlayer: Sup.Audio.SoundPlayer;
        
  export let allSolidBodies: Sup.ArcadePhysics2D.Body[] = [];
  export let allPlatformBodies: Sup.ArcadePhysics2D.Body[] = [];
        
  export enum Direction { Up, Left, Down, Right };
  export enum Location { Top, Left, Bottom, Right };
  export let stringLocation: string[] = ["top", "left", "bottom", "right"];
  export let opposingLocation: string[] = ["bottom", "right", "top", "left"];
  
  export function init() {
    
    // NOTE:  Behavior classes won't be recognized at runtime unless this script is the very last in the hierarchy
    // Load scene
    Sup.loadScene("Keep/Scene");
    Game.playerActor = Sup.getActor("Player");
    
    // Store solid bodies in a list separate from semi-solid bodies
    let platformBodies = Sup.getActor("Platforms").getChildren();
      for (let platBody of platformBodies) this.allPlatformBodies.push(platBody.arcadeBody2D);
    //let solidBodies = Sup.getActor("Solids").getChildren();
      //for (let solidBody of solidBodies) this.allSolidBodies.push(solidBody.arcadeBody2D);
    
    // Set Gravity
    Sup.ArcadePhysics2D.setGravity(0, -0.02);
    
    // Play Music
    Game.musicPlayer = new Sup.Audio.SoundPlayer("Keep/Music/Pyre", 0.25, { loop: true });
    musicPlayer.play();
    
  }
  
}

Game.init();