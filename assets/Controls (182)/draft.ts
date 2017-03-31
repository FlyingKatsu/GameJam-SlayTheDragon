module Controls {
  
  export let keyboard = {
    jump: [ "W", "UP", "SPACE" ],
    moveLeft: [ "A", "LEFT" ],
    moveDown: [ "S", "DOWN" ],
    moveRight: [ "D", "RIGHT" ],
    swap: [ "E", "SHIFsT", "Z" ],
    use: [ "C", "ENTER" ],
  };
  
  export function pressed( action:string ):boolean {
    return Controls.keyboard[action].reduce( (acc, key) => acc || Sup.Input.wasKeyJustPressed(key) );
    //return Sup.Input.wasKeyJustPressed( Controls.keyboard[action] );
  }
  
  export function held( action:string ):boolean {
    return Controls.keyboard[action].reduce( (acc, key) => acc || Sup.Input.isKeyDown(key) );
    //return Sup.Input.isKeyDown( Controls.keyboard[action] );
  }
  
  
}