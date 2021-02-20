---
title: Typefaces
---

Typeface allows part of the text to be set to a
different font style.

    This is the &b{bold} text.

The typeface can be nested.

    This is the &b{bold text and &i{italic} as well}.

Following are typefaces that can be selected for a specific 
part of a text.

+ em

  This is to denote a part of text should be set 
  to the style of emphasis.

  ```verbatim
  This is an &em{red} apple.
  ```

+ b

  This is to denote a part of text should be set 
  to the style of bold.     

  ```verbatim
  This is an &b{red} apple.
  ```

+ i

  This is to denote a part of text should be set 
  to the style of italic.     

  ```verbatim
  This is an &i{red} apple.
  ```

+ u

  This is to denote a part of text should be set 
  to the style of underlined text.     

  ```verbatim
  This is an &u{red} apple.
  ```

+ tt

  This is to denote a part of text should be set 
  to the style of typewrite text.     

  ```verbatim
  This is an &tt{red} apple.
  ```

+ br

  This is to insert a line break. For HTML it will be translated
  to ``<hr/>``. For LATEX it will be translated to ``\\newline``,
  which only works when it is inside a "paragraph". In another word,
  it will not work if it is inside a tabular and inside a column
  designated as "l", "c", or "r". It will work inside a column 
  designated as "p(1cm)".

  ```verbatim
  Hello &br{} world.
  ```

+ frac

  This is to insert a fraction.

+ sup

  This is to insert a superscript.

  ```verbatim
  a&sup{2} + b&sup{2} = c&sup{2}
  ```

+ sub

  This is to insert a subscript.

  ```verbatim
  a&sub{1}
  ```


    






