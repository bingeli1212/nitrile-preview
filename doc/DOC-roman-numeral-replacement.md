# Replacing Roman Numerals in the Source


# Using Roman Numerals in LaTeX

It is sometimes very stylish to use roman numbers. 
For instance, while referring to some monarchs from 
ancient or even contemporary history.

TeX actually provides primitive for converting 
arabic numbers such as "14" to a roman numeral
such as "xiv". The only thing 
is that it uses lowercase letters

    Louis \romannumeral{14}
    

# Defining a LaTeX Macro

However you can define a macro to insert roman 
numerals in caps. Add this code to the preamble 
of your document

    \newcommand{\RomanNumeralCaps}[1]
        {\MakeUppercase{\romannumeral #1}}


# Roman Numerals in Unicode

Roman Numerals existing as Unicode characters are
defined by the range of U+2160 to U+2188. The range
includes both Upper- and Lower-cases numerals,
as well as pre-combined characters
for numbers up to 12 (XII or XII). 
This allows a number (such as VIII) to  
exist as a single character
when typesetting would flow text vertically.
 
    U+2160 I
    U+2161 II
    U+2162 III
    U+2163 IV
    U+2164 V
    U+2165 VI
    U+2166 VII
    U+2167 VIII
    U+2168 IX
    U+2169 X
    U+216A XI
    U+216B XII
    U+216C L
    U+216D C
    U+216E D
    U+216F M
    U+2170 i
    U+2171 ii
    U+2172 iii
    U+2173 iv
    U+2174 v
    U+2175 vi
    U+2176 vii
    U+2177 viii
    U+2178 iv
    U+2174 v
    U+2175 vi
    U+2176 vii
    U+2177 viii
    U+2178 ix
    U+2179 x
    U+217A xi
    U+217B xii
    U+217C l
    U+217D c
    U+217E d
    U+217F m
    U+2180 
    
    
    
# Credits

- &uri{https://readthelatexmanual.wordpress.com/2016/02/21/roman-numerals-in-latex/}
