module Controls {
  
  export let keyboard = {
    jump: [ "W", "UP", "SPACE" ],
    moveLeft: [ "A", "LEFT" ],
    moveDown: [ "S", "DOWN" ],
    moveRight: [ "D", "RIGHT" ],
    swap: [ "Q", "SHIFT", "Z" ],
    use: [ "E", "C", "RETURN" ],
  };
  
  let cbPressed = (acc, key) => acc || ( Sup.Input.wasKeyJustPressed(key) );
  let cbHeld = (acc, key) => acc || Sup.Input.isKeyDown(key);
  
  export function pressed( action:string ):boolean {
    // let result = Sup.Input.wasKeyJustPressed( Controls.keyboard[action] );
    let result = Controls.keyboard[action].reduce( cbPressed, false );
    //Sup.log (result);
    return result != undefined; // For some reason wasKeyJustPressed returns undefined instead of false
  }
  
  export function held( action:string ):boolean {
    //let result = Sup.Input.isKeyDown( Controls.keyboard[action] );
    let result =  Controls.keyboard[action].reduce( cbHeld, false );
    //Sup.log (result);
    return result;
  }
  
  
}