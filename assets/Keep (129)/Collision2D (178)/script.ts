module Collision2D {
  
  // given an arcadeBody2D, calculate the line segments of the bounding box in local coordinates
  // needs to be recalculated whenever the arcadeBody2D changes
  export function getBBox( actor:Sup.Actor ) {
    let result = {
      top: { p0:{}, p1:{}, length:{} },
      left: { p0:{}, p1:{}, length:{} },
      bottom: { p0:{}, p1:{}, length:{} },
      right: { p0:{}, p1:{}, length:{} }
    };
    
    // An arcadeBody2D is centered at the Actor's position (which is based on the Sprite's origin point)
    // Cartesian Coordinates with +Y === UP and +X === RIGHT
    // A ------------ B
    // |     |        |   |
    // |   off.y      |   |
    // |     |        |   |
    // |    pos ----- |   | size.height
    // |        off.x |   |
    // |              |   |
    // |              |   |
    // C ------------ D
    //   ------------
    //    size.width
    
    let A, B, C, D;
    let pos = actor.getLocalPosition();
    let size = actor.arcadeBody2D.getSize();
    let off = actor.arcadeBody2D.getOffset();
    
    // Calculate the bounding points based on the given Actor's sprite and arcadeBody2D
    A = { x: pos.x - size.width + off.x, y: pos.y + size.height - off.y };
    B = { x: pos.x + size.width - off.x, y: pos.y + size.height - off.y };
    C = { x: pos.x - size.width + off.x, y: pos.y - size.height + off.y };
    D = { x: pos.x + size.width - off.x, y: pos.y - size.height + off.y };
    
    // Set segment values Top/AB, Left/AC, Bottom/CD, Right/BD
    result.top = { p0:A , p1:B , length:{x: B.x - A.x, y: B.y - A.y} };
    result.left = { p0:A , p1:C , length:{x: C.x - A.x, y: C.y - A.y} };
    result.bottom = { p0:C , p1:D , length:{x: D.x - C.x, y: D.y - C.y} };
    result.right = { p0:B , p1:D , length:{x: D.x - B.x, y: D.y - B.y} };
    
    return result;
  }
  
  // Calculates whether or not line segment A intersects line segment B
  // Assumes local bbox segments and provided world-space positions
  // Based on stackoverflow answer by Gavin: http://stackoverflow.com/a/1968345
  export function collides( posA: {x:number, y:number}, segA:{p0:{x:number,y:number}, p1:{x:number,y:number}, length:{x:number, y:number}}, 
                            posB: {x:number, y:number}, segB:{p0:{x:number,y:number}, p1:{x:number,y:number}, length:{x:number, y:number}} ): boolean {
    
    // Get BBox segment points in world space
    let A0 = { x: posA.x + segA.p0.x, y: posA.y + segA.p0.y };
    let A1 = { x: posA.x + segA.p1.x, y: posA.y + segA.p1.y };
    let B0 = { x: posB.x + segB.p0.x, y: posB.y + segB.p0.y };
    let B1 = { x: posB.x + segB.p1.x, y: posB.y + segB.p1.y };
    
    //Sup.log( A0 ); Sup.log( A1 ); Sup.log( B0 ); Sup.log( B1 );
    
    let denom = -segB.length.x * segA.length.y  +  segA.length.x * segB.length.y;
    Sup.log("Denom: " + denom);
    if (denom != 0) {
      let s = ( -segA.length.y * (A0.x - B0.x) + segA.length.x * (A0.y - B0.y) ) / denom;
      let t = ( -segB.length.x * (A0.y - B0.y) + segB.length.y * (A0.x - B0.x) ) / denom;
      Sup.log("S: " + s);
      Sup.log("T: " + t);
      if ( s >= 0 && s <= 1 && t >= 0 && t <= 1 ) return true;
    }
    
    return false;
  }
  
  
}
