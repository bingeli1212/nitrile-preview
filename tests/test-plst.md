---
title: test-plst.md
---

The XMLHttpRequest object is used to exchange data with a
server behind the scenes.  The `XMLHttpRequest` object is
the developers dream. With this object, you can

- Update a web page without reloading the page
- Request data from a server after the page has loaded
- Receive data from a server after the page has loaded
- Send data to a server in the background


# Properties

+ onreadystatechange
Stores a function (or the name of a function) to be
called automatically each time the `readyState`
property changes

+ readyState
Holds the status of the XML http request connection.
This value is in the range from 0 to 4:

  *  0  - means request not initialized;
  *  1  - means server connection established;
  *  2  - means request received;
  *  3  - means processing request;
  *  4  - means request finished and response is ready.

+ responseText
Returns the response data as a string.

+ responseXML
Returns the response data as XML data.

+ status
Returns the status-number (e.g. `404` for `Not Found` or `200` for `OK`)

+ statusText
Returns the status-text (e.g. `Not Found` or `OK`)




