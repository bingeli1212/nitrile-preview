---
title: Running JavaScript inside Browser
---

# Use "defer" attribute

If the scripts are loaded within the <head> of the document, then it's possible
use the defer attribute in script tag.

Example:

    <script src="demo_defer.js" defer></script>
    From https://developer.mozilla.org:

[ defer ]

This Boolean attribute is set to indicate to a browser that the script is meant
to be executed after the document has been parsed, but before firing
DOMContentLoaded.

This attribute must not be used if the src attribute is absent (i.e. for inline
scripts), in this case it would have no effect.

To achieve a similar effect for dynamically inserted scripts use async=false
instead. Scripts with the defer attribute will exec

# Events

It is also possible to add event listener

    document.addEventListener('readystatechange',event => {
      // When HTML/DOM elements are ready
      if (event.target.readyState === "interactive") {   
        //same as  addEventListener("DOMContentLoaded")
        alert("hi 1");
      }
      // When external resources are loaded: css, src...
      if (event.target.readyState === "complete") {
        alert("hi 2");
      }
    });

However, if this is the approach to take, then defer-attribute should be
removed from the script-element. Otherwise it is possible that the script
inside the head-element are not run when this event is fired.

