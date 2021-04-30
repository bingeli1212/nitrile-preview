---
title: Blurring The Color
---

# Blurring the Color

The <feGaussianBlur> SVG filter primitive blurs the input image by the amount
specified in stdDeviation, which defines the bell-curve.

This filter blurs an image. The parameter associated with this filter is the
standard deviation (stdDeviation) which controls the distance from which
neighboring pixels will be allowed to influence a pixel and hence, the amount
of blurring.

First, a filter is set up with an <feGaussianBlur> inside:

    <filter id="A">
     <feGaussianBlur stdDeviation="1" />
    </filter>

Then the <filter> is applied to an image to be blurred.

    <rect x="42%" y="10%" width="16%" height="25%"
    fill="white" filter="url(#A)"/>

