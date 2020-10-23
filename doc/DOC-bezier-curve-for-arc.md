Bezier curve for an arc

This is an 8-year-old question, but one that I recently struggled with, so I thought I'd share what I came up with. I spent a lot of time trying to use solution (9) from this text and couldn't get any sensible numbers out of it until I did some Googling and learned that, apparently, there were some typos in the equations. Per the corrections listed in this blog post, given the start and end points of the arc ([x1, y1] and [x4, y4], respectively) and the the center of the circle ([xc, yc]), one can derive the control points for a cubic bezier curve ([x2, y2] and [x3, y3]) as follows:

    ax = x1 – xc
    ay = y1 – yc
    bx = x4 – xc
    by = y4 – yc
    q1 = ax * ax + ay * ay
    q2 = q1 + ax * bx + ay * by
    k2 = 4/3 * (√(2 * q1 * q2) – q2) / (ax * by – ay * bx)


    x2 = xc + ax – k2 * ay
    y2 = yc + ay + k2 * ax
    x3 = xc + bx + k2 * by                                 
    y3 = yc + by – k2 * bx
