---
title: Complex.js - ℂ in JavaScript
---

Complex.js is a well tested JavaScript library to work with complex number
arithmetic in JavaScript. It implements every elementary complex number
manipulation function and the API is intentionally similar to ``Fraction.js``.
Furthermore, it's the basis of ``Polynomial.js`` and ``Math.js``.

This version has been modified so the following document is a modification
of the original README file. The main change is that to create a complex
number object we will have to use the ``Complex.create()`` function
instead of calling ``new Complex()`` as was the case for the original 
program.

# Examples

    let {Complex} = require('nitrile-preview-complex.js');
    let c = Complex.create("99.3+8i");
    c.mul({re: 3, im: 9}).div(4.9).sub(3, 2);

A classical use case for complex numbers is solving quadratic equations `ax² +
bx + c = 0` for all `a, b, c ∈ ℝ`:

    function quadraticRoot(a, b, c) {
      let sqrt = Complex.create(b * b - 4 * a * c).sqrt()
      let x1 = Complex.create(-b).add(sqrt).div(2 * a)
      let x2 = Complex.create(-b).sub(sqrt).div(2 * a)
      return {x1, x2}
    }
    // quadraticRoot(1, 4, 5) -> -2 ± i

# The 'Complex.create' function

The 'Complex.create' function would parse a string, an object, a float,
or two floats. If passed in an object, the object could be expected to
contain different members, and they could be one of the following
variants.

    var a = Complex.create({re: real, im: imaginary});
    var a = Complex.create({arg: angle, abs: radius});
    var a = Complex.create({phi: angle, r: radius});

If passed an array then it should be an arry of two numbers:

    var a = Complex.create([real, imaginary]); // Vector/Array syntax

If passed a single number, this number is treated as the real component
of the complex number.

    var a = Complex.create(55.4);

If passed a string, then it will scanned to see if it contains a imaginary
part. Following are valid inputs.

    var a = Complex.create("123.45");
    var a = Complex.create("15+3i");
    var a = Complex.create("i");

If passed two arguments, then each of them is expected to be the real
and imaginary component of the complex number.

    var a = Complex.create(3, 2); // 3+2i

# Attributes

For a returned object of a ``Complex.create`` function, it should have real and
imaginary part as attribute `re` and `im`. This allows you to print each component
such as follows.

    let c = Complex.create(3, 2);
    console.log("Real part:", c.re); // 3
    console.log("Imaginary part:", c.im); // 2

# Functions

+ Complex this.sign()

  Returns the complex sign, defined as the complex number normalized by it's absolute value

+ Complex this.add(n)

  Adds another complex number

+ Complex this.sub(n)

  Subtracts another complex number

+ Complex this.mul(n)

  Multiplies the number with another complex number

+ Complex this.div(n)

  Divides the number by another complex number

+ Complex this.pow(exp)

  Returns the number raised to the complex exponent (Note: `Complex.ZERO.pow(0)
  = Complex.ONE` by convention)

+ Complex this.sqrt()

  Returns the complex square root of the number

+ Complex this.exp()

  Returns `e^n` with complex exponent `n`. Following is how to show
  the Euler's identity formula.

  ```verbatim
  > var a = Complex.create(0,Math.PI)
  undefined
  > a.exp()
  { re: -1, im: 1.2246467991473532e-16 }
  ```

+ Complex this.log()

  Returns the natural logarithm (base `E`) of the actual complex number

  Note: The logarithm to a different base can be calculated with the following.

  ```verbatim
  z.log().div(Math.log(base))
  ```

+ double this.abs()

  Calculates the magnitude of the complex number

+ double this.arg()

  Calculates the angle of the complex number

+ Complex this.inverse()

  Calculates the multiplicative inverse of the complex number (1 / z)

+ Complex this.conjugate()

  Calculates the conjugate of the complex number (multiplies the imaginary part with -1)

+ Complex this.neg()

  Negates the number (multiplies both the real and imaginary part with -1) in order to get the additive inverse

+ Complex this.floor([places=0])

  Floors the complex number parts towards zero

+ Complex this.ceil([places=0])

  Ceils the complex number parts off zero

+ Complex this.round([places=0])

  Rounds the complex number parts

+ boolean this.equals(n)

  Checks if both numbers are exactly the same, if both numbers are infinite they
  are considered **not** equal.

+ boolean this.isNaN()

  Checks if the given number is not a number

+ boolean this.isFinite()

  Checks if the given number is finite

+ Complex this.clone()

  Returns a new Complex object instance with the same real and imaginary
  properties

+ Array this.toVector()

  Returns a Vector of the actual complex number with two components

+ String this.toString()

  Returns a string representation of the actual number. As of v1.9.0 the output is a bit more human readable

  ```verbatim   
  Complex.create(1, 2).toString(); // 1 + 2i
  Complex.create(0, 1).toString(); // i
  Complex.create(9, 0).toString(); // 9
  Complex.create(1, 1).toString(); // 1 + i
  ```

+ double this.valueOf()
  
  Returns the real part of the number if imaginary part is zero. Otherwise `null`


# Trigonometric functions

The following trigonometric functions are defined on Complex.js:

```tabular
| Trig   | Arcus   | Hyperbolic   | Area-Hyperbolic 
------------------------------------------------
| sin()  | asin()  | sinh()       | asinh()  
| cos()  | acos()  | cosh()       | acosh()  
| tan()  | atan()  | tanh()       | atanh() 
| cot()  | acot()  | coth()       | acoth() 
| sec()  | asec()  | sech()       | asech() 
| csc()  | acsc()  | csch()       | acsch() 
```

# Geometric Equivalence

Complex numbers can also be seen as a vector in the 2D space. Here is a simple
overview of basic operations and how to implement them with complex.js:

## New vector

  ```verbatim
  let v1 = Complex.create(1, 0);
  let v2 = Complex.create(1, 1);
  ```

## Scale vector

  ```verbatim
  scale(v1, factor):= v1.mul(factor)
  ```

## Vector norm

  ```verbatim
  norm(v):= v.abs()
  ```

## Translate vector

  ```verbatim
  translate(v1, v2):= v1.add(v2)
  ```

## Rotate vector around center

  ```verbatim
  rotate(v, angle):= v.mul({abs: 1, arg: angle})
  ```

## Rotate vector around a point

  ```verbatim
  rotate(v, p, angle):= v.sub(p).mul({abs: 1, arg: angle}).add(p)
  ```

## Distance to another vector

  ```verbatim
  distance(v1, v2):= v1.sub(v2).abs()
  ```


# Constants

Following are built-in constants that are either an instance of a Complex
object instance or a number itself. These constants can be used directly.

+ Complex.ZERO

  A complex zero value (south pole on the Riemann Sphere)

+ Complex.ONE

  A complex one instance

+ Complex.INFINITY

  A complex infinity value (north pole on the Riemann Sphere)

+ Complex.NAN

  A complex NaN value (not on the Riemann Sphere)

+ Complex.I

  An imaginary number i instance. Following is an example of returning ``e^i``.

  ```verbatim
  var a = Complex.I.exp();
  console.log(a.toString());
  ```

+ Complex.PI

  A complex PI instance

+ Complex.E

  A complex euler number instance. Following is another way of computing ``e^i``.

  ```verbatim
  var a = Complex.E.pow(Complex.I)
  console.log(a.toString());
  ```

+ Complex.EPSILON

  This is a number, that represents the infinitesimal amount that was being
  used internally by the Complex class when it checks for equality of certain
  quantities, such as during calls to `equals()`, in order to circumvent double
  imprecision.



# Installation

Installing complex.js is as easy as cloning this repo or use one of the
following commands:

    bower install complex.js

or

    npm install complex.js



# Using Complex.js with the browser

    <script src="complex.js"></script>
    <script>
        console.log(Complex("4+3i"));
    </script>

# Using Complex.js with require.js

    <script src="require.js"></script>
    <script>
    requirejs(['complex.js'],
    function(Complex) {
        console.log(Complex("4+3i"));
    });
    </script>

# Coding Style

As every library I publish, complex.js is also built to be as small as possible
after compressing it with Google Closure Compiler in advanced mode. Thus the
coding style orientates a little on maxing-out the compression rate. Please
make sure you keep this style if you plan to extend the library.


# Testing

If you plan to enhance the library, make sure you add test cases and all the
previous tests are passing. You can test the library with

    npm test


# Copyright and licensing

Copyright (c) 2015, [Robert Eisele](https://www.xarg.org/) Dual licensed under
the MIT or GPL Version 2 licenses.
