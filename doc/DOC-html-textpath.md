---
title: Drawing Text Along A Path
---

# Draw Text Along A Path

Note that the dx='' attribute in this case is used to shift the text along 
the path, such that when dx='' is set to be half the length of the path
and text-anchor='middle' then the text is placed around the center
of the path. the dy='' attribute shifts the text up and down the path, 
such that when dy='' is negative it shifts text up and when dy='' is 
positive it shifts text down. By default the text's base line aligns
with the path.

    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- to hide the path, it is usually wrapped in a <defs> element -->
      <!-- <defs> -->
      <path id="MyPath" fill="none" stroke="red"
            d="M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50" />
      <!-- </defs> -->
      <text>
        <textPath href="#MyPath">
          Quick brown fox jumps over the lazy dog.
        </textPath>
      </text>
    </svg>

