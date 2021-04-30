---
title: HTML Translation
---

# Issues

* For Radio Buttons and Check Boxes, the ideal solution would've been
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




