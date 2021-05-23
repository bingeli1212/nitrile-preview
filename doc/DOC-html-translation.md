---
title: HTML Translation
---

# Issues

- For Radio Buttons and Check Boxes, the ideal solution would've been
  to use Dingbats character U+274D for empty circles, and U+25CF for 
  filled radio buttons. But in practice there is a problem that
  U+25CF was being rendered as a very small black circle as opposed
  to a black circle that is the same size as that of U+274D. This
  would have made the list containing a mix of filled and unfilled
  circles looking extremely uncomfortable. Thus the solution to 
  show a list of radio buttons and checkboxes is to use the input-element
  of the HTML with its "type" attribute set to either "radiobutton" or 
  "checkbox". This presents another problem that the "readonly" attribute
  which is supposed to prevent its status from being changed by user, 
  does not work for radio buttons and checkboxes. Thus in order to 
  disallow an accidental change of button status all unchecked radio buttons
  and checkboxes are rendered as "disabled", which there is an attribute 
  for, and works. 

- For SVG Diagram, a dashed line is always drawn using dashed array of "3.0 3.0", and
  its stroke-linecap is always set to "butt". It has been observed that if it is set to
  "round" then the dashed part is too closed together reducing the gap between the
  components.

- For embedded SVG the "id" attribute of a defined element inside the <defs>..</defs>
  element need to have a unique ID string for the entire HTML file. 
  It has been observed that if the same ID attribute were used even when these elements
  are defined inside the <defs> element that are in different embedded SVG images, 
  the element that appears later will "overwrite" the element that appears earlier.





