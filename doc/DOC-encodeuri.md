---
title: Encode URI
---

# The encodeURI() Function

The JavaScript program 'encodeURI()' is to encode a string such that it will only 
have the following characters; all other characters will be encoded using
one of these characters.

    A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #

# The encodeURIComponent() Function

The ``encodeURI()`` function differs from that of ``encodeURIComponent()`` as the later
encodes additional characters that are not encoded by the first function.
Following example program intends to show what happens given the same string input
such that these two functions returns differently as the output.

    var set1 = ";,/?:@&=+$#"; 
      // Reserved Characters
    var set2 = "-_.!~*'()";   
      // Unreserved Marks
    var set3 = "ABC abc 123"; 
      // Alphanumeric Characters + Space

    console.log(encodeURI(set1)); 
      // ;,/?:@&=+$#
    console.log(encodeURI(set2)); 
      // -_.!~*'()
    console.log(encodeURI(set3)); 
      // ABC%20abc%20123 (the space gets encoded as %20)

    console.log(encodeURIComponent(set1)); 
      // %3B%2C%2F%3F%3A%40%26%3D%2B%24%23
    console.log(encodeURIComponent(set2)); 
      // -_.!~*'()
    console.log(encodeURIComponent(set3)); 
      // ABC%20abc%20123 (the space gets encoded as %20)

Note that encodeURI() by itself cannot form proper HTTP GET and POST requests,
such as for XMLHttpRequest, because "&", "+", and "=" are not encoded, which
are treated as special characters in GET and POST requests.
encodeURIComponent(), however, does encode these characters.

Note that encodeURI() by itself cannot form proper HTTP GET and POST requests,
such as for XMLHttpRequest, because "&", "+", and "=" are not encoded, which
are treated as special characters in GET and POST requests.
encodeURIComponent(), however, does encode these characters.

# Encoding a lone high surrogate throws

An URIError will be thrown if one attempts to encode a surrogate which is not
part of a high-low pair, e.g.,

    // high-low pair ok
    console.log(encodeURI('\uD800\uDFFF'));

    // lone high surrogate throws "URIError: malformed URI sequence"
    console.log(encodeURI('\uD800'));

    // lone low surrogate throws "URIError: malformed URI sequence"
    console.log(encodeURI('\uDFFF'));

# Encoding for IPv6

If one wishes to follow the more recent RFC3986 for URLs, which makes square
brackets reserved (for IPv6) and thus not encoded when forming something which
could be part of a URL (such as a host), the following code snippet may help:
