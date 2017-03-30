module Collision2D {
  
  // given an arcadeBody2D, calculate the line segments from the four rect points
  export function getCollisionPoints( actor:Sup.Actor ) {
    let result = {
      top: { p0:{}, p1:{}, length:{} },
      left: { p0:{}, p1:{}, length:{} },
      bottom: { p0:{}, p1:{}, length:{} },
      right: { p0:{}, p1:{}, length:{} }
    };
    
    // Calculate the collision points based on the given Actor's sprite and arcadeBody2D
    let A, B, C, D;
    A = { x:0, y:0 };
    B = { x:0, y:0 };
    C = { x:0, y:0 };
    D = { x:0, y:0 };
    
    // TODO
    
    
    // Set segment values Top/AB, Left/AC, Bottom/CD, Right/BD
    result.top = { p0:A , p1:B , length:{x: B.x - A.x, y: B.y - A.y} };
    result.left = { p0:A , p1:C , length:{x: C.x - A.x, y: C.y - A.y} };
    result.bottom = { p0:C , p1:D , length:{x: D.x - C.x, y: D.y - C.y} };
    result.right = { p0:B , p1:D , length:{x: D.x - B.x, y: D.y - B.y} };
    
    return result;
  }
  
  // Calculates whether or not line segment A intersects line segment B
  // Based on stackoverflow answer by Gavin: http://stackoverflow.com/a/1968345
  export function collides( segA:{p0:{x:number,y:number}, p1:{x:number,y:number}, length:{x:number, y:number}}, 
                            segB:{p0:{x:number,y:number}, p1:{x:number,y:number}, length:{x:number, y:number}} ): boolean {
    
    let denom = -segB.length.x * segA.length.y  +  segA.length.x * segB.length.y;
    
    if (denom != 0) {
      let s = ( -segA.length.y * (segA.p0.x - segB.p0.x) + segA.length.x * (segA.p0.y - segB.p0.y) ) / denom;
      let t = ( -segB.length.x * (segA.p0.y - segB.p0.y) + segB.length.y * (segA.p0.x - segB.p0.x) ) / denom;
      
      if ( s >= 0 && s <= 1 && t >= 0 && t <= 1 ) return true;
    }
    
    return false;
  }
  
  
}
