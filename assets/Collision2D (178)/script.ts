module Collision2D {
  
  // given an arcadeBody2D, calculate the edge and vertex values of the bounding box in world-space
  // needs to be recalculated whenever the actor moves
  export function getBBox( actor:Sup.Actor ) {
    
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
    
    let pos = actor.getPosition();
    let size = actor.arcadeBody2D.getSize();
    let off = actor.arcadeBody2D.getOffset();
    
    // Return the edge and vertex values in the result
    let edges = {
      top: pos.y + size.height/2 - off.y,
      bottom: pos.y - size.height/2 + off.y,
      left: pos.x - size.width/2 + off.x,
      right:pos.x + size.width/2 - off.x
    };
    
    let vert = {
      A: { x:edges.left , y:edges.top },
      B: { x:edges.right , y:edges.top },
      C: { x:edges.left , y:edges.bottom },
      D: { x:edges.right , y:edges.bottom } 
    };
    
    let seg = {
      top: { A:vert.A, B:vert.B },
      bottom: { A:vert.C, B:vert.D },
      left: { A:vert.A, B:vert.C },
      right: { A:vert.B, B:vert.D } 
    }
    
    //Sup.log(edges); Sup.log(vert); Sup.log(seg); 
    return { edges:edges, vert:vert, seg:seg };
  }
  
  // Returns null if no intersections
  // Returns an object of booleans for edge intersections and whether or not segment is fully inside/on box
  // Assumes bbox and seg in world space
  export function collides( edges:{ top:number,bottom:number,left:number,right:number }, 
                            seg:{ A:{x:number,y:number}, B:{x:number,y:number} } ) {
    // Check if A or B is inside bbox
    let innerA = (seg.A.x >= edges.left && seg.A.x <= edges.right) && (seg.A.y >= edges.bottom && seg.A.y <= edges.top);
    let innerB = (seg.B.x >= edges.left && seg.B.x <= edges.right) && (seg.B.y >= edges.bottom && seg.B.y <= edges.top);
    
    // Stop early if neither is inside
    if (!innerA && !innerB) return null;
    
    let result = {
      top: false, 
      bottom: false, 
      left: false, 
      right: false, 
      inside: false
    };
    
    // Simple check for sitting on an edge
    if ( innerA ) {
      result.top = seg.A.y == edges.top || result.top;
      result.bottom = seg.A.y == edges.bottom || result.bottom;
      result.left = seg.A.x == edges.left || result.left;
      result.right = seg.A.x == edges.right || result.right;
    }
    if ( innerB ) {
      result.top = seg.B.y == edges.top || result.top;
      result.bottom = seg.B.y == edges.bottom || result.bottom;
      result.left = seg.B.x == edges.left || result.left;
      result.right = seg.B.x == edges.right || result.right;
    }
    
    // Set whether or not the segment sits entirely in/on the box
    result.inside = innerA && innerB;
    
    // If not completely inside/on bbox, check where the other point is located wrt bbox
    if (!result.inside) {
      let outerPoint = ( innerA ) ? seg.B : seg.A;
      result.top = outerPoint.y > edges.top || result.top;
      result.bottom = outerPoint.y < edges.bottom || result.bottom;
      result.left = outerPoint.x < edges.left || result.left;
      result.right = outerPoint.x > edges.right || result.right;
    }
    
    return result;
  }
  
  
  // given an arcadeBody2D, calculate the line segments of the bounding box in local coordinates
  // needs to be recalculated whenever the arcadeBody2D changes
  export function getBBoxLocal( actor:Sup.Actor ) {
    
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
    
    //let A, B, C, D;
    let pos = actor.getLocalPosition();
    let size = actor.arcadeBody2D.getSize();
    let off = actor.arcadeBody2D.getOffset();
    
    // Calculate the bounding points based on the given Actor's sprite and arcadeBody2D
    /*A = { x: pos.x - size.width + off.x, y: pos.y + size.height - off.y };
    B = { x: pos.x + size.width - off.x, y: pos.y + size.height - off.y };
    C = { x: pos.x - size.width + off.x, y: pos.y - size.height + off.y };
    D = { x: pos.x + size.width - off.x, y: pos.y - size.height + off.y };
    
    let result = {
      top: { p0:{}, p1:{}, length:{} },
      left: { p0:{}, p1:{}, length:{} },
      bottom: { p0:{}, p1:{}, length:{} },
      right: { p0:{}, p1:{}, length:{} }
    };
    
    // Set segment values Top/AB, Left/CA, Bottom/CD, Right/DB
    result.top = { p0:A , p1:B , length:{x: B.x - A.x, y: B.y - A.y} };
    result.left = { p0:A , p1:C , length:{x: A.x - C.x, y: A.y - C.y} };
    result.bottom = { p0:C , p1:D , length:{x: D.x - C.x, y: D.y - C.y} };
    result.right = { p0:B , p1:D , length:{x: B.x - D.x, y: B.y - D.y} };*/
    
    // Return the edge values in the result
    let result = {
      top: pos.y + size.height - off.y,
      bottom: pos.y - size.height + off.y,
      left: pos.x - size.width + off.x,
      right:pos.x + size.width - off.x
    };
    
    Sup.log(result);
    return result;
  }
  
  // Calculates whether or not line segment A intersects line segment B
  // Assumes local bbox segments and provided world-space positions
  // Based on stackoverflow answer by Gavin: http://stackoverflow.com/a/1968345
  /*export function collides( posA: {x:number, y:number}, segA:{p0:{x:number,y:number}, p1:{x:number,y:number}, length:{x:number, y:number}}, 
                            posB: {x:number, y:number}, segB:{p0:{x:number,y:number}, p1:{x:number,y:number}, length:{x:number, y:number}} ): boolean {
    
    Sup.log(segA.length);
    Sup.log(segB.length);
    
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
  }*/
  
  
}
