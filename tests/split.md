---
title: test.md
fonts: jp{contex:ipaexmincho,xelatex:Hiragino Mincho ProN,lualatex:ipaexmincho}
       A{contex:Unifont,xelatex:Unifont,lualatex:Unifont,start:0x2700}
program: lualatex
bodyfontsuit: office 
---
%=piA{width:40,frame,viewport:26 4}
\set ty : 0.2
\origin ^x:13
\origin ^y:2
\car.1 {xgrid:0.5,ygrid:0.5,xaxis:-6 6,xtick:-5 -4 -3 -2 -1 0 1 2 3 4 5} (0,0)
\var pi = -3.14
\drawdot ^car:1 (pi,0)
\drawlabel.u ^car:1 "&pi;" (pi,0)
%


# Slide 1

.listing{split:3 3 4}
&label{james}
\\
```
// Calculate the centre of the ellipse
// Based on http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
// James---Yu
var x1 = 150;  // Starting x-point of the arc
var y1 = 150;  // Starting y-point of the arc
var x2 = 400;  // End x-point of the arc
var y2 = 300;  // End y-point of the arc
var fA = 1;    // Large arc flag
var fS = 1;    // Sweep flag
var rx = 100;  // Horizontal radius of ellipse
var ry =  50;  // Vertical radius of ellipse
var phi = 0;   // Angle between co-ord system and ellipse x-axes
var fA = 1;
```


# Slide 2

.table{split:4,head}
&label{james}
\\
```tab{frame,rules:all,head}
Type  \\ Unit        \\ Symbol  \\ Equivalents
SI    \\ Centimeter  \\ (cm)    \\ 1 centimeter = 10 millimeters 
SI    \\ Decimeter   \\ (dm)    \\ 1 decimeter = 10 centimeters
SI    \\ Meter       \\ (m)     \\ 1 meter = 10 decimeters
SI    \\ Decameter   \\         \\ 1 decameter = 10 meters
SI    \\ Hectometer  \\         \\ 1 hectometer = 100 meters
SI    \\ Kilometer   \\ (km)    \\ 1 kilometer = 1000 meters
USCS  \\ Mile        \\ (mi)    \\ 1 mile = 5280 feet = 1609.34 meters
USCS  \\ Yard        \\ (yd)    \\ 1 yard = 3 feet = 0.9144 meters
USCS  \\ Foot        \\ (ft)    \\ 1 foot = 12 inches = 0.3048 meters
USCS  \\ Inch        \\ (in)    \\ 1 inch = 1/12 foot = 0.0254 meters
```



# Slide 3

.table
&label{james}
\\
```{head,frame,rules:all}
Type  \\ Unit        \\ Symbol  \\ Equivalents
SI    \\ Centimeter  \\ (cm)    \\ 1 centimeter = 10 millimeters 
SI    \\ Decimeter   \\ (dm)    \\ 1 decimeter = 10 centimeters
SI    \\ Meter       \\ (m)     \\ 1 meter = 10 decimeters
SI    \\ Decameter   \\         \\ 1 decameter = 10 meters
SI    \\ Hectometer  \\         \\ 1 hectometer = 100 meters
SI    \\ Kilometer   \\ (km)    \\ 1 kilometer = 1000 meters
USCS  \\ Mile        \\ (mi)    \\ 1 mile = 5280 feet = 1609.34 meters
USCS  \\ Yard        \\ (yd)    \\ 1 yard = 3 feet = 0.9144 meters
USCS  \\ Foot        \\ (ft)    \\ 1 foot = 12 inches = 0.3048 meters
USCS  \\ Inch        \\ (in)    \\ 1 inch = 1/12 foot = 0.0254 meters
```

.page

# Slide 4

```{fontsize:small}
Type  Unit        Symbol  Equivalents
SI    Centimeter  (cm)    1 centimeter = 10 millimeters 
SI    Decimeter   (dm)    1 decimeter = 10 centimeters
SI    Meter       (m)     1 meter = 10 decimeters
SI    Decameter           1 decameter = 10 meters
SI    Hectometer          1 hectometer = 100 meters
SI    Kilometer   (km)    1 kilometer = 1000 meters
USCS  Mile        (mi)    1 mile = 5280 feet = 1609.34 meters
USCS  Yard        (yd)    1 yard = 3 feet = 0.9144 meters
USCS  Foot        (ft)    1 foot = 12 inches = 0.3048 meters
USCS  Inch        (in)    1 inch = 1/12 foot = 0.0254 meters
```


.page

# Slide 5

```par
Type   Equivalents \\
SI     1 centimeter = 10 millimeters  \\
SI     1 decimeter = 10 centimeters \\
SI     1 meter = 10 decimeters \\
SI     1 decameter = 10 meters \\
SI     1 hectometer = 100 meters \\
SI     1 kilometer = 1000 meters \\
USCS   1 mile = 5280 feet = 1609.34 meters \\
USCS   1 yard = 3 feet = 0.9144 meters \\
USCS   1 foot = 12 inches = 0.3048 meters \\
USCS   1 inch = 1/12 foot = 0.0254 meters
```

