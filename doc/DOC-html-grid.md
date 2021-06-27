---
title: CSS Grid Layout Module
---

# CSS Grid Layout Module

Following is a grid layout that works for showing a list of "cards" laid horizontally
across the page, with a caption at the top and a subtitle at the bottom for each image.

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      grid-gap: 20px;
    }
    
    .card {
      display: grid;
      grid-template-rows: max-content 200px 1fr;
    }
    
    .card img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    
An example HTML utilizing this layout is shown below.
    
    <div class="cards">
      <article class="card">
        <header>
          <h2>Balloon One</h2>
        </header>    
        <img src="balloon1.jpg">
        <div class="content">
          <p>Red.</p>
        </div>              
      </article>
      <article class="card">
        <header>
          <h2>Balloon Two</h2>
        </header>    
        <img src="balloon2.jpg">
        <div class="content">
          <p>White.</p>
        </div>
        <footer>wonderful!</footer>
      </article>              
    </div>
            
This should look like the following:

```diagram{frame,viewport: 21 12}
box.1 {w:8,h:10} (2,1)  
box.2 {w:8,h:10} (11,1)
box "Balloon One" {w:8,h:2} (2,1) [m:0,8]
box "Balloon Two" {w:8,h:2} (11,1) [m:0,8]
box "balloon1.jpg" {w:8,h:5} (2,1) [m:0,3]
box "balloon2.jpg" {w:8,h:5} (11,1) [m:0,3]
box "Red." {w:8,h:3} (2,1) [m:0,0]
box "White." {w:8,h:2} (11,1) [m:0,1]
box "wonderful!" {w:8,h:1} (11,1)
```
    