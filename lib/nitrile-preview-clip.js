'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
class NitrilePreviewClip extends NitrilePreviewBase {
  constructor(){
    super();
    this.INSIDE = 0; // 0000
    this.LEFT = 1;   // 0001
    this.RIGHT = 2;  // 0010
    this.BOTTOM = 4; // 0100
    this.TOP = 8;    // 1000
  }
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  ComputeOutCode(x,y,xmin,ymin,xmax,ymax){
    var code;
    code = this.INSIDE;     // initialised as being inside of [[clip window]]
    if (x < xmin) {          // to the left of clip window
      code |= this.LEFT;
    } else if (x > xmax) {     // to the right of clip window
      code |= this.RIGHT;
    }
    if (y < ymin) {          // below the clip window
      code |= this.BOTTOM;
    } else if (y > ymax) {     // above the clip window
      code |= this.TOP;
    }
    return code;
  }

  // Cohen–Sutherland clipping algorithm clips a line from
  // P0 = (x0, y0) to P1 = (x1, y1) against a rectangle with 
  // diagonal from (xmin, ymin) to (xmax, ymax).
  CohenSutherlandLineClipAndDraw(x0, y0, x1, y1, xmin,ymin,xmax,ymax){
    // compute outcodes for P0, P1, and whatever point lies outside the clip rectangle
    var outcode0 = this.ComputeOutCode(x0, y0, xmin,ymin,xmax,ymax);
    var outcode1 = this.ComputeOutCode(x1, y1, xmin,ymin,xmax,ymax);
    var accept = false;

    while (true) {
      if (!(outcode0 | outcode1)) {
        // bitwise OR is 0: both points inside window; trivially accept and exit loop
        accept = true;
        break;
      } else if (outcode0 & outcode1) {
        // bitwise AND is not 0: both points share an outside zone (LEFT, RIGHT, TOP,
        // or BOTTOM), so both must be outside window; exit loop (accept is false)
        break;
      } else {
        // failed both tests, so calculate the line segment to clip
        // from an outside point to an intersection with clip edge
        var x, y;

        // At least one endpoint is outside the clip rectangle; pick it.
        var outcodeOut = outcode1 > outcode0 ? outcode1 : outcode0;

        // Now find the intersection point;
        // use formulas:
        //   slope = (y1 - y0) / (x1 - x0)
        //   x = x0 + (1 / slope) * (ym - y0), where ym is ymin or ymax
        //   y = y0 + slope * (xm - x0), where xm is xmin or xmax
        // No need to worry about divide-by-zero because, in each case, the
        // outcode bit being tested guarantees the denominator is non-zero
        if (outcodeOut & this.TOP) {           // point is above the clip window
          x = x0 + (x1 - x0) * (ymax - y0) / (y1 - y0);
          y = ymax;
        } else if (outcodeOut & this.BOTTOM) { // point is below the clip window
          x = x0 + (x1 - x0) * (ymin - y0) / (y1 - y0);
          y = ymin;
        } else if (outcodeOut & this.RIGHT) {  // point is to the right of clip window
          y = y0 + (y1 - y0) * (xmax - x0) / (x1 - x0);
          x = xmax;
        } else if (outcodeOut & this.LEFT) {   // point is to the left of clip window
          y = y0 + (y1 - y0) * (xmin - x0) / (x1 - x0);
          x = xmin;
        }

        // Now we move outside point to intersection point to clip
        // and get ready for next pass.
        if (outcodeOut == outcode0) {
          x0 = x;
          y0 = y;
          outcode0 = this.ComputeOutCode(x0, y0, xmin,ymin,xmax,ymax);
        } else {
          x1 = x;
          y1 = y;
          outcode1 = this.ComputeOutCode(x1, y1, xmin,ymin,xmax,ymax);
        }
      }
    }
    return [accept,x0,y0,x1,y1];
  }
}
module.exports = { NitrilePreviewClip }
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
function run(){
  var clip = new NitrilePreviewClip();
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(0,0,10,10,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(1,1,9,9,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(-1,-1,11,11,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(-1,5,5,11,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(-1,5,5,-1,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(-5,5,5,15,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(-6,5,5,16,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
  var [accept,x0,y0,x1,y1] = clip.CohenSutherlandLineClipAndDraw(-6,-5,-5,-16,0,0,10,10);
  console.log('accept',accept,x0,y0,x1,y1);
}
if(require.main===module){
  run();
}
