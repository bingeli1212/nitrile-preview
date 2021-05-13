---
title: Translation To Beamer
---

The translation to Beamer intends to produce one or more slides
using the LATEX "beamer" class.

# The checkboxes

Following is an example of problem set that would show
three checkboxes each for one of the multiple choices,
and with a solution that "A" is the correct answer,
which corresponds to the first choice.

    Q: What is the type of the syllogism for the following 
    sentence?
      
    ```lines    
    1. All cars have wheels.
    2. I drive a car.
    3. Therefore, my car has wheels.
    ```
    
    ```lines    
    [ ] A. Categorical (If A is in C then B is in C)
    [ ] B. Disjunctive (If A is not true then B is true)
    [ ] C. Hypothetical (If A is true then B is true)
    ```
    
    [ Answer ] A
    
    ```lines    
    [X] A. Categorical (If A is in C then B is in C)
    [ ] B. Disjunctive (If A is not true then B is true)
    [ ] C. Hypothetical (If A is true then B is true)
    ```

# Radio Buttons

Radio buttons are for choices that only one is correct.
Following is an example.

    Q: What is the type of the syllogism for the following 
    sentence?
    
    ```lines
    1. All cars have wheels.
    2. I drive a car.
    3. Therefore, my car has wheels.
    ```

    ```lines    
    ( ) A. Categorical (If A is in C then B is in C)
    ( ) B. Disjunctive (If A is not true then B is true)
    ( ) C. Hypothetical (If A is true then B is true)
    ```
    
    [ Answer ] A
    
    ```lines    
    [X] A. Categorical (If A is in C then B is in C)
    [ ] B. Disjunctive (If A is not true then B is true)
    [ ] C. Hypothetical (If A is true then B is true)
    ```


# Displaying code

You can use the traditional \verbatim, or probably better, the
listings package.

If you use \verbatim or lstlisting within a frame, be sure to declare
the frame fragile:

    \begin{frame}[fragile]

You may also need the relsize package:

    \usepackage{relsize}

To use listings, place

    \usepackage{listings}

near the top of your source file. The simplest usage is

    \begin{lstlisting}
    place your code here
    \end{lstlisting}

See the listings manual for all the other tricks that can be done.


# Beamer custom paper size

If you use LaTeX to produce slides using Beamer, again the default is
4:3. In current Beamer classes, put the following line in the
preamble.

    \documentclass[aspectratio=169]{beamer}

If that doesn’t work, use

    \usepackage[orientation=landscape,size=custom,width=16,height=9.75,scale=0.5,
    debug]{beamerposter}

(9.75 because it spans 16:9 and 16:10.)
Note: If you already have content in your slides, you should review it to make sure that it is laid out
correctly. 

It seems that the latest version of 1.07 has disabled the portrait or landscape option.

    1.07 – bugfixed custom size handling, portrait or landscape settings are ignored now 
    1.06 – added the type1cm package for scalable math fonts
    1.05 – added version check for xkeyval package
    1.04 – added custom size handling
    1.03 – improved predefined size handling 1.02 – minor bugfixes
    1.01 – bugfixed size handling
    1.00 – first beamerposter release

Following poster paper sizes are supported: DIN–A0, DIN–A1, DIN–A2,
DIN–A3, DIN–A4, and custom sizes like double DIN–A0 possible

    DIN-Formate  | in mm
    ==============================
    A0           | 841 x 1189 
    A1           | 594 x 841
    A2           | 420 x 594
    A3           | 297 x 420
    A4           | 210 x 297
    A5           | 148 x 210
    A6           | 105 x 148
    A7           | 74 x 105
    A8           | 52 x 74
    A9           | 37 x 52
    A10          | 26 x 37





# Aspect ratio

Setting the "aspectratio=" attribute would have
allowed beamer to change its paper size. The values
are following string and each value sets the paper size to 
a predefined value. By default, the paper size is
128mm by 96mm(4:3).

    \documentclass[aspectratio=169]{beamer}

+ \documentclass[aspectratio=1610]{beamer}
  
  Sets aspect ratio to 16:10, and frame size to 160 mm by 100 mm.

+ \documentclass[aspectratio=169]{beamer}

  Sets aspect ratio to 16:9, and frame size to 160 mm by 90 mm.

+ \documentclass[aspectratio=149]{beamer}

  Sets aspect ratio to 14:9, and frame size to 140 mm by 90 mm.

+ \documentclass[aspectratio=141]{beamer}

  Sets aspect ratio to 1.41:1, and frame size to 148.5 mm by 105 mm.

+ \documentclass[aspectratio=54]{beamer}

  Sets aspect ratio to 5:4, and frame size to 125 mm by 100 mm.

+ \documentclass[aspectratio=43]{beamer}

  The default aspect ratio and frame size. You need not specify this option.

+ \documentclass[aspectratio=32]{beamer}

  Sets aspect ratio to 3:2, and frame size to 135 mm by 90 mm.


Aside from using these options, you should refrain from changing the
“paper size.” However, you can change the size of the left and right
margins, which default to 1cm. To change them, you should use the
following command:

    \setbeamersize{⟨options⟩}

The following ⟨options⟩ can be given:

* text margin left=⟨TEX dimension⟩ sets a new left margin. This
  excludes the left sidebar. Thus, it is the distance between the
  right edge of the left sidebar and the left edge of the text.

* text margin right=⟨TEX dimension⟩ sets a new right margin.

* sidebar width left=⟨TEX dimension⟩ sets the size of the left
  sidebar. Currently, this command should be given before a shading is
  installed for the sidebar canvas.

* sidebar width right=⟨TEX dimension⟩ sets the size of the right
  sidebar.

* description width=⟨TEX dimension⟩ sets the default width of
  description labels, see Section 12.1.

* description width of=⟨text⟩ sets the default width of description
  labels to the width of the ⟨text⟩, see Section 12.1.

* mini frame size=⟨TEX dimension⟩ sets the size of mini frames in a
  navigation bar. When two mini frame icons are shown alongside each
  other, their left end points are ⟨TEX dimension⟩ far apart.

* mini frame offset=⟨TEX dimension⟩ set an additional vertical offset
  that is added to the mini frame size when arranging mini frames
  vertically. 

  
# Fragile

When a keyword "fragile" is added as an option to a frame, then that frame is
considered "fragile". Fragile frames are necessary when a frame includes
verbatim text and listings. 

    \begin{frame}[fragile]
    \begin{verbatim}
      ...
    \end{verbatim}
    \begin{lstlisting}
      ...
    \end{lstlisting}
    \end{frame}






