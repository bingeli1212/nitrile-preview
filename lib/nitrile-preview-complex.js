'use babel';

/**
 * @license Complex.js v2.0.11 11/02/2016
 *
 * Copyright (c) 2016, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

/**
 *
 * This class allows the manipulation of complex numbers.
 * You can pass a complex number in different formats. Either as 
 * object, double, string or two integer parameters.
 *
 * Object form
 * { re: <real>, im: <imaginary> }
 * { arg: <angle>, abs: <radius> }
 * { phi: <angle>, r: <radius> }
 *
 * Array / Vector form
 * [ real, imaginary ]
 *
 * Double form
 * 99.3 - Single double value
 *
 * String form
 * '23.1337' - Simple real number
 * '15+3i' - a simple complex number
 * '3-i' - a simple complex number
 *
 * Example:
 *
 * var c = new Complex('99.3+8i');
 * c.mul({r: 3, i: 9}).div(4.9).sub(3, 2);
 *
 */

class Complex {

  /**
   * @constructor
   * @returns {Complex}
   */
  constructor(a, b) {

    this.re = 0;
    this.im = 0;

    var z = this.parse(a, b);
    this.re = z.re;
    this.im = z.im;

    this.constant = [];
    this.constant['ZERO'] = new Complex(0, 0);
    this.constant['ONE'] = new Complex(1, 0);
    this.constant['I'] = new Complex(0, 1);
    this.constant['PI'] = new Complex(Math.PI, 0);
    this.constant['E'] = new Complex(Math.E, 0);
    this.constant['INFINITY'] = new Complex(Infinity, Infinity);
    this.constant['NAN'] = new Complex(NaN, NaN);
    this.constant['EPSILON'] = 1e-16;

  }

  cosh (x) {
    return (Math.exp(x) + Math.exp(-x)) * 0.5;
  }

  sinh (x) {
    return (Math.exp(x) - Math.exp(-x)) * 0.5;
  }

  /**
   * Calculates cos(x) - 1 using Taylor series if x is small.
   *
   * @param {number} x
   * @returns {number} cos(x) - 1
   */

  cosm1 (x) {
    var limit = Math.PI/4;
    if (x < -limit || x > limit) {
      return (Math.cos(x) - 1.0);
    }

    var xx = x * x;
    return xx *
      (-0.5 + xx *
        (1/24 + xx *
          (-1/720 + xx *
            (1/40320 + xx *
              (-1/3628800 + xx *
                (1/4790014600 + xx *
                  (-1/87178291200 + xx *
                    (1/20922789888000)
                  )
                )
              )
            )
          )
        )
      )
  }

  hypot (x, y) {

    var a = Math.abs(x);
    var b = Math.abs(y);

    if (a < 3000 && b < 3000) {
      return Math.sqrt(a * a + b * b);
    }

    if (a < b) {
      a = b;
      b = x / y;
    } else {
      b = y / x;
    }
    return a * Math.sqrt(1 + b * b);
  }

  parser_exit() {
    throw SyntaxError('Invalid Param');
  }

  /**
   * Calculates log(sqrt(a^2+b^2)) in a way to avoid overflows
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  logHypot(a, b) {

    var _a = Math.abs(a);
    var _b = Math.abs(b);

    if (a === 0) {
      return Math.log(_b);
    }

    if (b === 0) {
      return Math.log(_a);
    }

    if (_a < 3000 && _b < 3000) {
      return Math.log(a * a + b * b) * 0.5;
    }

    /* I got 4 ideas to compute this property without overflow:
     *
     * Testing 1000000 times with random samples for a,b ∈ [1, 1000000000] against a big decimal library to get an error estimate
     *
     * 1. Only eliminate the square root: (OVERALL ERROR: 3.9122483030951116e-11)

     Math.log(a * a + b * b) / 2

     *
     *
     * 2. Try to use the non-overflowing pythagoras: (OVERALL ERROR: 8.889760039210159e-10)

     var fn = function(a, b) {
     a = Math.abs(a);
     b = Math.abs(b);
     var t = Math.min(a, b);
     a = Math.max(a, b);
     t = t / a;

     return Math.log(a) + Math.log(1 + t * t) / 2;
     };

     * 3. Abuse the identity cos(atan(y/x) = x / sqrt(x^2+y^2): (OVERALL ERROR: 3.4780178737037204e-10)

     Math.log(a / Math.cos(Math.atan2(b, a)))

     * 4. Use 3. and apply log rules: (OVERALL ERROR: 1.2014087502620896e-9)

     Math.log(a) - Math.log(Math.cos(Math.atan2(b, a)))

     */

    return Math.log(a / Math.cos(Math.atan2(b, a)));
  }

  parse (a, b) {

    var z = {'re': 0, 'im': 0};

    if (a === undefined || a === null) {
      z['re'] =
              z['im'] = 0;
    } else if (b !== undefined) {
      z['re'] = a;
      z['im'] = b;
    } else
      switch (typeof a) {

        case 'object':

          if ('im' in a && 're' in a) {
            z['re'] = a['re'];
            z['im'] = a['im'];
          } else if ('abs' in a && 'arg' in a) {
            if (!Number.isFinite(a['abs']) && Number.isFinite(a['arg'])) {
              return this.constant['INFINITY'];
            }
            z['re'] = a['abs'] * Math.cos(a['arg']);
            z['im'] = a['abs'] * Math.sin(a['arg']);
          } else if ('r' in a && 'phi' in a) {
            if (!Number.isFinite(a['r']) && Number.isFinite(a['phi'])) {
              return this.constant['INFINITY'];
            }
            z['re'] = a['r'] * Math.cos(a['phi']);
            z['im'] = a['r'] * Math.sin(a['phi']);
          } else if (a.length === 2) { // Quick array check
            z['re'] = a[0];
            z['im'] = a[1];
          } else {
            this.parser_exit();
          }
          break;

        case 'string':

          z['im'] = /* void */
                  z['re'] = 0;

          var tokens = a.match(/\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g);
          var plus = 1;
          var minus = 0;

          if (tokens === null) {
            this.parser_exit();
          }

          for (var i = 0; i < tokens.length; i++) {

            var c = tokens[i];

            if (c === ' ' || c === '\t' || c === '\n') {
              /* void */
            } else if (c === '+') {
              plus++;
            } else if (c === '-') {
              minus++;
            } else if (c === 'i' || c === 'I') {

              if (plus + minus === 0) {
                this.parser_exit();
              }

              if (tokens[i + 1] !== ' ' && !isNaN(tokens[i + 1])) {
                z['im'] += parseFloat((minus % 2 ? '-' : '') + tokens[i + 1]);
                i++;
              } else {
                z['im'] += parseFloat((minus % 2 ? '-' : '') + '1');
              }
              plus = minus = 0;

            } else {

              if (plus + minus === 0 || isNaN(c)) {
                this.parser_exit();
              }

              if (tokens[i + 1] === 'i' || tokens[i + 1] === 'I') {
                z['im'] += parseFloat((minus % 2 ? '-' : '') + c);
                i++;
              } else {
                z['re'] += parseFloat((minus % 2 ? '-' : '') + c);
              }
              plus = minus = 0;
            }
          }

          // Still something on the stack
          if (plus + minus > 0) {
            this.parser_exit();
          }
          break;

        case 'number':
          z['im'] = 0;
          z['re'] = a;
          break;

        default:
          this.parser_exit();
      }

    if (isNaN(z['re']) || isNaN(z['im'])) {
      // If a calculation is NaN, we treat it as NaN and don't throw
      //this.parser_exit();
    }

    return z;
  }

  /**
   * Calculates the sign of a complex number, which is a normalized complex
   *
   * @returns {Complex}
   */
  sign () {

    var abs = this['abs']();

    return new Complex(
            this['re'] / abs,
            this['im'] / abs);
  }

  /**
   * Adds two complex numbers
   *
   * @returns {Complex}
   */
  add(a, b) {

    var z = new Complex(a, b);

    // Infinity + Infinity = NaN
    if (this['isInfinite']() && z['isInfinite']()) {
      return this.constant['NAN'];
    }

    // Infinity + z = Infinity { where z != Infinity }
    if (this['isInfinite']() || z['isInfinite']()) {
      return this.constant['INFINITY'];
    }

    return new Complex(
            this['re'] + z['re'],
            this['im'] + z['im']);
  }

  /**
   * Subtracts two complex numbers
   *
   * @returns {Complex}
   */
  sub(a, b) {

    var z = new Complex(a, b);

    // Infinity - Infinity = NaN
    if (this['isInfinite']() && z['isInfinite']()) {
      return this.constant['NAN'];
    }

    // Infinity - z = Infinity { where z != Infinity }
    if (this['isInfinite']() || z['isInfinite']()) {
      return this.constant['INFINITY'];
    }

    return new Complex(
            this['re'] - z['re'],
            this['im'] - z['im']);
  }

  /**
   * Multiplies two complex numbers
   *
   * @returns {Complex}
   */
  mul(a, b) {

    var z = new Complex(a, b);

    // Infinity * 0 = NaN
    if ((this['isInfinite']() && z['isZero']()) || (this['isZero']() && z['isInfinite']())) {
      return this.constant['NAN'];
    }

    // Infinity * z = Infinity { where z != 0 }
    if (this['isInfinite']() || z['isInfinite']()) {
      return this.constant['INFINITY'];
    }

    // Short circuit for real values
    if (z['im'] === 0 && this['im'] === 0) {
      return new Complex(this['re'] * z['re'], 0);
    }

    return new Complex(
            this['re'] * z['re'] - this['im'] * z['im'],
            this['re'] * z['im'] + this['im'] * z['re']);
  }

  /**
   * Divides two complex numbers
   *
   * @returns {Complex}
   */
  div(a, b) {

    var z = new Complex(a, b);

    // 0 / 0 = NaN and Infinity / Infinity = NaN
    if ((this['isZero']() && z['isZero']()) || (this['isInfinite']() && z['isInfinite']())) {
      return this.constant['NAN'];
    }

    // Infinity / 0 = Infinity
    if (this['isInfinite']() || z['isZero']()) {
      return this.constant['INFINITY'];
    }

    // 0 / Infinity = 0
    if (this.isZero() || z.isInfinite()) {
      return this.constant['ZERO'];
    }

    a = this['re'];
    b = this['im'];

    var c = z['re'];
    var d = z['im'];
    var t, x;

    if (0 === d) {
      // Divisor is real
      return new Complex(a / c, b / c);
    }

    if (Math.abs(c) < Math.abs(d)) {

      x = c / d;
      t = c * x + d;

      return new Complex(
              (a * x + b) / t,
              (b * x - a) / t);

    } else {

      x = d / c;
      t = d * x + c;

      return new Complex(
              (a + b * x) / t,
              (b - a * x) / t);
    }
  }

  /**
   * Calculate the power of two complex numbers
   *
   * @returns {Complex}
   */
  pow(a, b) {

    var z = new Complex(a, b);

    var a = this['re'];
    var b = this['im'];

    if (z.isZero()) {
      return this.constant['ONE'];
    }

    // If the exponent is real
    if (z['im'] === 0) {

      if (b === 0 && a >= 0) {

        return new Complex(Math.pow(a, z['re']), 0);

      } else if (a === 0) { // If base is fully imaginary

        switch ((z['re'] % 4 + 4) % 4) {
          case 0:
            return new Complex(Math.pow(b, z['re']), 0);
          case 1:
            return new Complex(0, Math.pow(b, z['re']));
          case 2:
            return new Complex(-Math.pow(b, z['re']), 0);
          case 3:
            return new Complex(0, -Math.pow(b, z['re']));
        }
      }
    }

    /* I couldn't find a good formula, so here is a derivation and optimization
     *
     * z_1^z_2 = (a + bi)^(c + di)
     *         = exp((c + di) * log(a + bi)
     *         = pow(a^2 + b^2, (c + di) / 2) * exp(i(c + di)atan2(b, a))
     * =>...
     * Re = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * cos(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
     * Im = (pow(a^2 + b^2, c / 2) * exp(-d * atan2(b, a))) * sin(d * log(a^2 + b^2) / 2 + c * atan2(b, a))
     *
     * =>...
     * Re = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * cos(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
     * Im = exp(c * log(sqrt(a^2 + b^2)) - d * atan2(b, a)) * sin(d * log(sqrt(a^2 + b^2)) + c * atan2(b, a))
     *
     * =>
     * Re = exp(c * logsq2 - d * arg(z_1)) * cos(d * logsq2 + c * arg(z_1))
     * Im = exp(c * logsq2 - d * arg(z_1)) * sin(d * logsq2 + c * arg(z_1))
     *
     */

    if (a === 0 && b === 0 && z['re'] > 0 && z['im'] >= 0) {
      return Complex['ZERO'];
    }

    var arg = Math.atan2(b, a);
    var loh = this.logHypot(a, b);

    a = Math.exp(z['re'] * loh - z['im'] * arg);
    b = z['im'] * loh + z['re'] * arg;
    return new Complex(
            a * Math.cos(b),
            a * Math.sin(b));
  }

  /**
   * Calculate the complex square root
   *
   * @returns {Complex}
   */
  sqrt() {

    var a = this['re'];
    var b = this['im'];
    var r = this['abs']();

    var re, im;

    if (a >= 0) {

      if (b === 0) {
        return new Complex(Math.sqrt(a), 0);
      }

      re = 0.5 * Math.sqrt(2.0 * (r + a));
    } else {
      re = Math.abs(b) / Math.sqrt(2 * (r - a));
    }

    if (a <= 0) {
      im = 0.5 * Math.sqrt(2.0 * (r - a));
    } else {
      im = Math.abs(b) / Math.sqrt(2 * (r + a));
    }

    return new Complex(re, b < 0 ? -im : im);
  }

  /**
   * Calculate the complex exponent
   *
   * @returns {Complex}
   */
  exp() {

    var tmp = Math.exp(this['re']);

    if (this['im'] === 0) {
      //return new Complex(tmp, 0);
    }
    return new Complex(
            tmp * Math.cos(this['im']),
            tmp * Math.sin(this['im']));
  }

  /**
   * Calculate the complex exponent and subtracts one.
   *
   * This may be more accurate than `Complex(x).exp().sub(1)` if
   * `x` is small.
   *
   * @returns {Complex}
   */
  expm1() {

    /**
     * exp(a + i*b) - 1
     = exp(a) * (cos(b) + j*sin(b)) - 1
     = expm1(a)*cos(b) + cosm1(b) + j*exp(a)*sin(b)
     */

    var a = this['re'];
    var b = this['im'];

    return new Complex(
            Math.expm1(a) * Math.cos(b) + cosm1(b),
            Math.exp(a) * Math.sin(b));
  }

  /**
   * Calculate the natural log
   *
   * @returns {Complex}
   */
  log() {

    var a = this['re'];
    var b = this['im'];

    if (b === 0 && a > 0) {
      //return new Complex(Math.log(a), 0);
    }

    return new Complex(
            this.logHypot(a, b),
            Math.atan2(b, a));
  }

  /**
   * Calculate the magnitude of the complex number
   *
   * @returns {number}
   */
  abs() {

    return this.hypot(this['re'], this['im']);
  }

  /**
   * Calculate the angle of the complex number
   *
   * @returns {number}
   */
  arg() {

    return Math.atan2(this['im'], this['re']);
  }

  /**
   * Calculate the sine of the complex number
   *
   * @returns {Complex}
   */
  sin() {

    // sin(c) = (e^b - e^(-b)) / (2i)

    var a = this['re'];
    var b = this['im'];

    return new Complex(
            Math.sin(a) * cosh(b),
            Math.cos(a) * sinh(b));
  }

  /**
   * Calculate the cosine
   *
   * @returns {Complex}
   */
  cos() {

    // cos(z) = (e^b + e^(-b)) / 2

    var a = this['re'];
    var b = this['im'];

    return new Complex(
            Math.cos(a) * cosh(b),
            -Math.sin(a) * sinh(b));
  },

  /**
   * Calculate the tangent
   *
   * @returns {Complex}
   */
  tan() {

    // tan(c) = (e^(ci) - e^(-ci)) / (i(e^(ci) + e^(-ci)))

    var a = 2 * this['re'];
    var b = 2 * this['im'];
    var d = Math.cos(a) + cosh(b);

    return new Complex(
            Math.sin(a) / d,
            sinh(b) / d);
  }

  /**
   * Calculate the cotangent
   *
   * @returns {Complex}
   */
  cot() {

    // cot(c) = i(e^(ci) + e^(-ci)) / (e^(ci) - e^(-ci))

    var a = 2 * this['re'];
    var b = 2 * this['im'];
    var d = Math.cos(a) - cosh(b);

    return new Complex(
            -Math.sin(a) / d,
            sinh(b) / d);
  }

  /**
   * Calculate the secant
   *
   * @returns {Complex}
   */
  sec() {

    // sec(c) = 2 / (e^(ci) + e^(-ci))

    var a = this['re'];
    var b = this['im'];
    var d = 0.5 * cosh(2 * b) + 0.5 * Math.cos(2 * a);

    return new Complex(
            Math.cos(a) * cosh(b) / d,
            Math.sin(a) * sinh(b) / d);
  }

  /**
   * Calculate the cosecans
   *
   * @returns {Complex}
   */
  csc() {

    // csc(c) = 2i / (e^(ci) - e^(-ci))

    var a = this['re'];
    var b = this['im'];
    var d = 0.5 * cosh(2 * b) - 0.5 * Math.cos(2 * a);

    return new Complex(
            Math.sin(a) * cosh(b) / d,
            -Math.cos(a) * sinh(b) / d);
  }

  /**
   * Calculate the complex arcus sinus
   *
   * @returns {Complex}
   */
  asin() {

    // asin(c) = -i * log(ci + sqrt(1 - c^2))

    var a = this['re'];
    var b = this['im'];

    var t1 = new Complex(
            b * b - a * a + 1,
            -2 * a * b).sqrt();

    var t2 = new Complex(
            t1['re'] - b,
            t1['im'] + a).log();

    return new Complex(t2['im'], -t2['re']);
  }

  /**
   * Calculate the complex arcus cosinus
   *
   * @returns {Complex}
   */
  acos() {

    // acos(c) = i * log(c - i * sqrt(1 - c^2))

    var a = this['re'];
    var b = this['im'];

    var t1 = new Complex(
            b * b - a * a + 1,
            -2 * a * b).sqrt();

    var t2 = new Complex(
            t1['re'] - b,
            t1['im'] + a).log();

    return new Complex(Math.PI / 2 - t2['im'], t2['re']);
  }

  /**
   * Calculate the complex arcus tangent
   *
   * @returns {Complex}
   */
  atan() {

    // atan(c) = i / 2 log((i + x) / (i - x))

    var a = this['re'];
    var b = this['im'];

    if (a === 0) {

      if (b === 1) {
        return new Complex(0, Infinity);
      }

      if (b === -1) {
        return new Complex(0, -Infinity);
      }
    }

    var d = a * a + (1.0 - b) * (1.0 - b);

    var t1 = new Complex(
            (1 - b * b - a * a) / d,
            -2 * a / d).log();

    return new Complex(-0.5 * t1['im'], 0.5 * t1['re']);
  }

  /**
   * Calculate the complex arcus cotangent
   *
   * @returns {Complex}
   */
  acot() {

    // acot(c) = i / 2 log((c - i) / (c + i))

    var a = this['re'];
    var b = this['im'];

    if (b === 0) {
      return new Complex(Math.atan2(1, a), 0);
    }

    var d = a * a + b * b;
    return (d !== 0)
            ? new Complex(
                    a / d,
                    -b / d).atan()
            : new Complex(
                    (a !== 0) ? a / 0 : 0,
                    (b !== 0) ? -b / 0 : 0).atan();
  }

  /**
   * Calculate the complex arcus secant
   *
   * @returns {Complex}
   */
  asec() {

    // asec(c) = -i * log(1 / c + sqrt(1 - i / c^2))

    var a = this['re'];
    var b = this['im'];

    if (a === 0 && b === 0) {
      return new Complex(0, Infinity);
    }

    var d = a * a + b * b;
    return (d !== 0)
            ? new Complex(
                    a / d,
                    -b / d).acos()
            : new Complex(
                    (a !== 0) ? a / 0 : 0,
                    (b !== 0) ? -b / 0 : 0).acos();
  }

  /**
   * Calculate the complex arcus cosecans
   *
   * @returns {Complex}
   */
  acsc() {

    // acsc(c) = -i * log(i / c + sqrt(1 - 1 / c^2))

    var a = this['re'];
    var b = this['im'];

    if (a === 0 && b === 0) {
      return new Complex(Math.PI / 2, Infinity);
    }

    var d = a * a + b * b;
    return (d !== 0)
            ? new Complex(
                    a / d,
                    -b / d).asin()
            : new Complex(
                    (a !== 0) ? a / 0 : 0,
                    (b !== 0) ? -b / 0 : 0).asin();
  }

  /**
   * Calculate the complex sinh
   *
   * @returns {Complex}
   */
  sinh() {

    // sinh(c) = (e^c - e^-c) / 2

    var a = this['re'];
    var b = this['im'];

    return new Complex(
            sinh(a) * Math.cos(b),
            cosh(a) * Math.sin(b));
  }

  /**
   * Calculate the complex cosh
   *
   * @returns {Complex}
   */
  cosh() {

    // cosh(c) = (e^c + e^-c) / 2

    var a = this['re'];
    var b = this['im'];

    return new Complex(
            cosh(a) * Math.cos(b),
            sinh(a) * Math.sin(b));
  }

  /**
   * Calculate the complex tanh
   *
   * @returns {Complex}
   */
  tanh() {

    // tanh(c) = (e^c - e^-c) / (e^c + e^-c)

    var a = 2 * this['re'];
    var b = 2 * this['im'];
    var d = this.cosh(a) + Math.cos(b);

    return new Complex(
            sinh(a) / d,
            Math.sin(b) / d);
  }

  /**
   * Calculate the complex coth
   *
   * @returns {Complex}
   */
  coth() {

    // coth(c) = (e^c + e^-c) / (e^c - e^-c)

    var a = 2 * this['re'];
    var b = 2 * this['im'];
    var d = this.cosh(a) - Math.cos(b);

    return new Complex(
            this.sinh(a) / d,
            -Math.sin(b) / d);
  },

  /**
   * Calculate the complex coth
   *
   * @returns {Complex}
   */
  csch() {

    // csch(c) = 2 / (e^c - e^-c)

    var a = this['re'];
    var b = this['im'];
    var d = Math.cos(2 * b) - this.cosh(2 * a);

    return new Complex(
            -2 * sinh(a) * Math.cos(b) / d,
            2 * cosh(a) * Math.sin(b) / d);
  }

  /**
   * Calculate the complex sech
   *
   * @returns {Complex}
   */
  sech() {

    // sech(c) = 2 / (e^c + e^-c)

    var a = this['re'];
    var b = this['im'];
    var d = Math.cos(2 * b) + this.cosh(2 * a);

    return new Complex(
            2 * this.cosh(a) * Math.cos(b) / d,
            -2 * this.sinh(a) * Math.sin(b) / d);
  },

  /**
   * Calculate the complex asinh
   *
   * @returns {Complex}
   */
  asinh() {

    // asinh(c) = log(c + sqrt(c^2 + 1))

    var tmp = this['im'];
    this['im'] = -this['re'];
    this['re'] = tmp;
    var res = this['asin']();

    this['re'] = -this['im'];
    this['im'] = tmp;
    tmp = res['re'];

    res['re'] = -res['im'];
    res['im'] = tmp;
    return res;
  }

  /**
   * Calculate the complex acosh
   *
   * @returns {Complex}
   */
  acosh() {

    // acosh(c) = log(c + sqrt(c^2 - 1))

    var res = this['acos']();
    if (res['im'] <= 0) {
      var tmp = res['re'];
      res['re'] = -res['im'];
      res['im'] = tmp;
    } else {
      var tmp = res['im'];
      res['im'] = -res['re'];
      res['re'] = tmp;
    }
    return res;
  }

  /**
   * Calculate the complex atanh
   *
   * @returns {Complex}
   */
  atanh() {

    // atanh(c) = log((1+c) / (1-c)) / 2

    var a = this['re'];
    var b = this['im'];

    var noIM = a > 1 && b === 0;
    var oneMinus = 1 - a;
    var onePlus = 1 + a;
    var d = oneMinus * oneMinus + b * b;

    var x = (d !== 0)
            ? new Complex(
                    (onePlus * oneMinus - b * b) / d,
                    (b * oneMinus + onePlus * b) / d)
            : new Complex(
                    (a !== -1) ? (a / 0) : 0,
                    (b !== 0) ? (b / 0) : 0);

    var temp = x['re'];
    x['re'] = this.logHypot(x['re'], x['im']) / 2;
    x['im'] = Math.atan2(x['im'], temp) / 2;
    if (noIM) {
      x['im'] = -x['im'];
    }
    return x;
  }

  /**
   * Calculate the complex acoth
   *
   * @returns {Complex}
   */
  acoth() {

    // acoth(c) = log((c+1) / (c-1)) / 2

    var a = this['re'];
    var b = this['im'];

    if (a === 0 && b === 0) {
      return new Complex(0, Math.PI / 2);
    }

    var d = a * a + b * b;
    return (d !== 0)
            ? new Complex(
                    a / d,
                    -b / d).atanh()
            : new Complex(
                    (a !== 0) ? a / 0 : 0,
                    (b !== 0) ? -b / 0 : 0).atanh();
  }

  /**
   * Calculate the complex acsch
   *
   * @returns {Complex}
   */
  acsch() {

    // acsch(c) = log((1+sqrt(1+c^2))/c)

    var a = this['re'];
    var b = this['im'];

    if (b === 0) {

      return new Complex(
              (a !== 0)
              ? Math.log(a + Math.sqrt(a * a + 1))
              : Infinity, 0);
    }

    var d = a * a + b * b;
    return (d !== 0)
            ? new Complex(
                    a / d,
                    -b / d).asinh()
            : new Complex(
                    (a !== 0) ? a / 0 : 0,
                    (b !== 0) ? -b / 0 : 0).asinh();
  },

  /**
   * Calculate the complex asech
   *
   * @returns {Complex}
   */
  asech() {

    // asech(c) = log((1+sqrt(1-c^2))/c)

    var a = this['re'];
    var b = this['im'];

    if (this.isZero()) {
      return this.constant['INFINITY'];
    }

    var d = a * a + b * b;
    return (d !== 0)
            ? new Complex(
                    a / d,
                    -b / d).acosh()
            : new Complex(
                    (a !== 0) ? a / 0 : 0,
                    (b !== 0) ? -b / 0 : 0).acosh();
  }

  /**
   * Calculate the complex inverse 1/z
   *
   * @returns {Complex}
   */
  inverse() {

    // 1 / 0 = Infinity and 1 / Infinity = 0
    if (this['isZero']()) {
      return this.constant['INFINITY'];
    }

    if (this['isInfinite']()) {
      return Complex['ZERO'];
    }

    var a = this['re'];
    var b = this['im'];

    var d = a * a + b * b;

    return new Complex(a / d, -b / d);
  }

  /**
   * Returns the complex conjugate
   *
   * @returns {Complex}
   */
  conjugate() {

    return new Complex(this['re'], -this['im']);
  },

  /**
   * Gets the negated complex number
   *
   * @returns {Complex}
   */
  neg() {

    return new Complex(-this['re'], -this['im']);
  }

  /**
   * Ceils the actual complex number
   *
   * @returns {Complex}
   */
  ceil(places) {

    var places = Math.pow(10, places || 0);

    return new Complex(
            Math.ceil(this['re'] * places) / places,
            Math.ceil(this['im'] * places) / places);
  }

  /**
   * Floors the actual complex number
   *
   * @returns {Complex}
   */
  floor(places) {

    var places = Math.pow(10, places || 0);

    return new Complex(
            Math.floor(this['re'] * places) / places,
            Math.floor(this['im'] * places) / places);
  }

  /**
   * Ceils the actual complex number
   *
   * @returns {Complex}
   */
  round(places) {

    var places = Math.pow(10, places || 0);

    return new Complex(
            Math.round(this['re'] * places) / places,
            Math.round(this['im'] * places) / places);
  }

  /**
   * Compares two complex numbers
   *
   * **Note:** new Complex(Infinity).equals(Infinity) === false
   *
   * @returns {boolean}
   */
  equals(a, b) {

    var z = new Complex(a, b);

    return Math.abs(z['re'] - this['re']) <= this.constant['EPSILON'] &&
            Math.abs(z['im'] - this['im']) <= this.constant['EPSILON'];
  }

  /**
   * Clones the actual object
   *
   * @returns {Complex}
   */
  clone() {

    return new Complex(this['re'], this['im']);
  }

  /**
   * Gets a string of the actual complex number
   *
   * @returns {string}
   */
  toString() {

    var a = this['re'];
    var b = this['im'];
    var ret = "";

    if (this.isNaN()) {
      return 'NaN';
    }

    if (this.isInfinite()) {
      return 'Infinity';
    }

    // If is real number
    if (b === 0) {
      return ret + a;
    }

    if (a !== 0) {
      ret+= a;
      ret+= " ";
      if (b < 0) {
        b = -b;
        ret+= "-";
      } else {
        ret+= "+";
      }
      ret+= " ";
    } else if (b < 0) {
      b = -b;
      ret+= "-";
    }

    if (1 !== b) { // b is the absolute imaginary part
      ret+= b;
    }
    return ret + "i";
  }

  /**
   * Returns the actual number as a vector
   *
   * @returns {Array}
   */
  toVector() {

    return [this['re'], this['im']];
  }

  /**
   * Returns the actual real value of the current object
   *
   * @returns {number|null}
   */
  valueOf() {

    if (this['im'] === 0) {
      return this['re'];
    }
    return null;
  }

  /**
   * Determines whether a complex number is not on the Riemann sphere.
   *
   * @returns {boolean}
   */
  isNaN() {
    return this.isNaN(this['re']) || this.isNaN(this['im']);
  }

  /**
   * Determines whether or not a complex number is at the zero pole of the
   * Riemann sphere.
   *
   * @returns {boolean}
   */
  isZero() {
    return this['im'] === 0 && this['re'] === 0;
  }

  /**
   * Determines whether a complex number is not at the infinity pole of the
   * Riemann sphere.
   *
   * @returns {boolean}
   */
  isFinite() {
    return this.isFinite(this['re']) && this.isFinite(this['im']);
  }

  /**
   * Determines whether or not a complex number is at the infinity pole of the
   * Riemann sphere.
   *
   * @returns {boolean}
   */
  isInfinite() {
    return !(this['isNaN']() || this['isFinite']());
  }
}
module.exports = { Complex }

