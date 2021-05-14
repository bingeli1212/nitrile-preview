---
title: HTML Semantic Tags
---

# The <article> tag

- Each <article> should be identified, typically by including a heading
  (<h1>-<h6> element) as a child of the <article> element.

- When an <article> element is nested, the inner element represents an article
  related to the outer element. For example, the comments of a blog post can be
  <article> elements nested in the <article> representing the blog post.

- Author information of an <article> element can be provided through the
  <address> element, but it doesn't apply to nested <article> elements.

- The publication date and time of an <article> element can be described using
  the datetime attribute of a <time> element. Note that the pubdate attribute
  of <time> is no longer a part of the W3C HTML5 standard.

Following is an example of using <article> tags recursively.

    <article class="film_review">
      <h2>Jurassic Park</h2>
      <section class="main_review">
        <h3>Review</h3>
        <p>Dinos were great!</p>
      </section>
      <section class="user_reviews">
        <h3>User reviews</h3>
        <article class="user_review">
          <h4>Too scary!</h4>
          <p>Way too scary for me.</p>
          <footer>
            <p>
              Posted on
              <time datetime="2015-05-16 19:00">May 16</time>
              by Lisa.
            </p>
          </footer>
        </article>
        <article class="user_review">
          <h4>Love the dinos!</h4>
          <p>I agree, dinos are my favorite.</p>
          <footer>
            <p>
              Posted on
              <time datetime="2015-05-17 19:00">May 17</time>
              by Tom.
            </p>
          </footer>
        </article>
      </section>
      <footer>
        <p>
          Posted on
          <time datetime="2015-05-15 19:00">May 15</time>
          by Staff.
        </p>
      </footer>
    </article>

# The <hgroup> tag

The HTML <hgroup> element represents a multi-level heading for a section of a
document. It groups a set of <h1>–<h6> elements.

    <hgroup> 
      <h1>Calculus I</h1> 
      <h2>Fundamentals</h2> 
    </hgroup> 
    <p>This course will start with a brief introduction about the limit of a
    function. Then we will describe how the idea of derivative emerges in the
    Physics and Geometry fields. After that, we will explain that the key to
    master calculus is …</p>


