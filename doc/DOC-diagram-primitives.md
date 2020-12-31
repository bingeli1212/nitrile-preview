---
title: Diagram Primitive Functions
---

# Diagram primitive functions

Following are primitive function that
must be implemented by a Diagram subclass.

~~~tabbing{n:1}
p_fillclipath(_coords,g)
p_fill(coords,g)
p_draw(coords,g)
p_stroke(coords,g)
p_arrow(coords,g)
p_revarrow(coords,g)
p_dblarrow(coords,g)
p_circle(x,y,radius,g)
p_rect(x,y,w,h,g)
p_line(x1,y1,x2,y2,g,arrow)
p_qbezier_line(x0,y0, x1,y1, x2,y2, g, arrow)
p_cbezier_line(x0,y0, x1,y1, x2,y2, x3,y3, g, arrow)
p_rhbar(x,y,g)
p_lhbar(x,y,g)
p_tvbar(x,y,g)
p_bvbar(x,y,g)
p_label(x,y,txt,ts,ta,g)
p_pie(x,y,radius,angle1,angle2,g)
p_chord(x,y,radius,angle1,angle2,g)
p_cseg(x,y,radius,angle1,angle2,g)
p_ellipse(x,y,Rx,Ry,angle,g)
p_dot_square(x,y,g)
p_dot_circle(x,y,g)
p_arc(x1,y1,x2,y2,Rx,Ry,bigarcflag,g)
p_shape(x,y,p,g,operation)
~~~

