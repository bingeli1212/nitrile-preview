---
title: HTML Gradients
---



# Gradient Fill for Ball

If the gradient fill is for a 'ball' type, then there is only one color needed
to appear in the "shadecolor=" option, which is the color of the ball. The highlight
of the ball is always to be shown in white, which is "rgb(255,255,255)". 
Following is an example where the "shadecolor=teal" has been specified, where
the color "teal" will have to be translated to a RGB color of "rgb(0,128,128)".

    <defs>
    <radialGradient id="1" cx="0.5" cy="0.5" fx="0.3" fy="0.3" r="0.5"> 
      <stop offset="0%" stop-color="rgb(255,255,255)"/> 
      <stop offset="100%" stop-color="rgb(0,128,128)"/> 
    </radialGradient>
    </defs>
    <path d='... z' fill='url(#1)' stroke='none'/>

If no color is specified by the "shadecolor=" option, then a gray color
is assumed, in which case the "stop-color" will be set to "rgb(128,128,128)".

    <defs>
    <radialGradient id="1" cx="0.5" cy="0.5" fx="0.3" fy="0.3" r="0.5"> 
      <stop offset="0%" stop-color="rgb(255,255,255)"/> 
      <stop offset="100%" stop-color="rgb(128,128,128)"/> 
    </radialGradient>
    </defs>
    <path d='... z' fill='url(#1)' stroke='none'/>



# CSS For Gradients

Following is an example of setting up a linear gradient
for the background.

    .linear-gradient {
      background: linear-gradient(to right, red, orange, 
        yellow, green, blue, indigo, violet);
    }
   
Following is an example of setting up a radial 
gradient for the background.

    .radial-gradient {
      background: radial-gradient(red, yellow, 
        rgb(30, 144, 255));

Following is a repeating linear gradient.

    .linear-repeat {
      background: repeating-linear-gradient(to top left,
        lightpink, lightpink 5px, white 5px, white 10px);
    }

    .radial-repeat {
      background: repeating-radial-gradient(powderblue,
        powderblue 8px, white 8px, white 16px);
    }

Following is a Conic gradient example.

    .conic-gradient {
      background: conic-gradient(lightpink, white, powerblue);
    }


