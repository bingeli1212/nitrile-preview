---
title: CSS Grid Layout Module
doc: page
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


# The "display" property

The children of the parent set to "display:grid" automatically
become "grid items". 



# The columns, rows & gaps

In the following example, the white blocks are grid items. They
are arranged into rows and column. Thus we have three rows and
three columns in the following example. The spaces between grid
items are called "gap", which is colored blue in the following
example.

.figure
  
  ```diagram{frame,viewport:10 10}
  var r = 10
  fill {fillcolor:blue} &rectangle{(0,0),10,1}
  fill {fillcolor:blue} &rectangle{(0,3),10,1}
  fill {fillcolor:blue} &rectangle{(0,6),10,1}
  fill {fillcolor:blue} &rectangle{(0,9),10,1}
  fill {fillcolor:blue} &rectangle{(0,0),1,10}
  fill {fillcolor:blue} &rectangle{(3,0),1,10}
  fill {fillcolor:blue} &rectangle{(6,0),1,10}
  fill {fillcolor:blue} &rectangle{(9,0),1,10}
  ```

You can adjust the gap size by using one of the following properties:

- grid-column-gap
- grid-row-gap
- grid-gap

Following is an example of 9 grid items arranged into 
three columns. The three columns are controlled by the
appearance of the "grid-template-columns" CSS property
that has three "auto" entries, separated by white spaces.

.sample

  <style>
  .grid-container {
    display: grid;
    grid-row-gap: 50px;
    grid-template-columns: auto auto auto;
  }
  .grid-item {
    text-align: center;
  }
  </style>
  <div class="grid-container">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>  
    <div class="grid-item">4</div>
    <div class="grid-item">5</div>
    <div class="grid-item">6</div>  
    <div class="grid-item">7</div>
    <div class="grid-item">8</div>
    <div class="grid-item">9</div>  
  </div>
    
It would appear as the following 
picture.

.figure
  Three rows items where each row is exactly three items
  because of the parent container has configured as so.
  The gap between neighboring rows is always 50px.

  ```diagram{frame,viewport:21 7}
  config w 7
  config h 1
  box "7" (0,0)
  box "8" (7,0)
  box "9" (14,0) 
  box "4" (0,3) 
  box "5" (7,3) 
  box "6" (14,3) 
  box "1" (0,6)
  box "2" (7,6)
  box "3" (14,6)
  ```
  
Similarly, the gap between columns are denoted by the 
"grid-column-gap". It is also possible state both the row gap
and column gap by the "grid-gap" property.

- grid-gap: 50px 100px


# Grid lines
 
The lines between rows and columns are called "grid lines".
For row lines they are number from to bottom, and for column lines
they are number from left to right.
Each line represents part of a position that would have
started a particular grid item.

.figure{subfigure}
  Column lines and row lines.

  column lines
  ```diagram{frame,viewport:14 14}
  var r = 10
  fill {fillcolor:blue} &rectangle{(0,0),10,1}
  fill {fillcolor:blue} &rectangle{(0,3),10,1}
  fill {fillcolor:blue} &rectangle{(0,6),10,1}
  fill {fillcolor:blue} &rectangle{(0,9),10,1}
  fill {fillcolor:blue} &rectangle{(0,0),1,10}
  fill {fillcolor:blue} &rectangle{(3,0),1,10}
  fill {fillcolor:blue} &rectangle{(6,0),1,10}
  fill {fillcolor:blue} &rectangle{(9,0),1,10}
  draw (0.5,0)[v:11] 
  draw (3.5,0)[v:11]
  draw (6.5,0)[v:11]
  draw (9.5,0)[v:11]
  drawtext "Line 1" (0,11) 
  drawtext "Line 2" (3,11)
  drawtext "Line 3" (6,11)
  drawtext "Line 4" (9,11)
  ```
  row lines
  ```diagram{frame,viewport:14 14}
  var r = 10
  fill {fillcolor:blue} &rectangle{(0,0),10,1}
  fill {fillcolor:blue} &rectangle{(0,3),10,1}
  fill {fillcolor:blue} &rectangle{(0,6),10,1}
  fill {fillcolor:blue} &rectangle{(0,9),10,1}
  fill {fillcolor:blue} &rectangle{(0,0),1,10}
  fill {fillcolor:blue} &rectangle{(3,0),1,10}
  fill {fillcolor:blue} &rectangle{(6,0),1,10}
  fill {fillcolor:blue} &rectangle{(9,0),1,10}
  draw ^down:0.5 (0,10)[h:11]
  drawtext "Line 1" (&lastpt)
  draw ^down:0.5 (0,7)[h:11]
  drawtext "Line 2" (&lastpt)
  draw ^down:0.5 (0,4)[h:11]
  drawtext "Line 3" (&lastpt)
  draw ^down:0.5 (0,1)[h:11]
  drawtext "Line 4" (&lastpt)
  ```
    
This conventions of number of grid lines allows for an item to 
be moved to a specific grid. 

.sample
 
  .item1 {
    grid-column-start: 2;
    grid-column-end: 4;
  }
  
This example would have asked that the item 1 (which is of CSS class "item1")
be moved to start from column line 2, and end at column line 4. This would have 
changed the appearance to be figure &ref{grid:gridline1}.

.figure
  &label{grid:gridline1}
  The first item has been moved to start at column line 2 and
  end at column line 4. All other items are to following after 
  this grid item, following the same order when it comes to
  filling up the rows and columns of the grid as the example
  above.

  ```diagram{frame,viewport:21 10}
  config w 7
  config h 1
  box "1" {w:14,h:1} (7,9)
  box "2" (0,6) "3" [h:7] "4" [h:7]
  box "5" (0,3) "6" [h:7] "7" [h:7]
  box "8" (0,0) "9" [h:7] 
  ```


# Additional CSS properties

Following are additional CSS properties pertaining
to grid layout.

+ column-gap	
  Specifies the gap between the columns
+ gap	
  A shorthand property for the row-gap and the column-gap properties
+ grid	
  A shorthand property for the grid-template-rows, grid-template-columns, grid-template-areas, grid-auto-rows, grid-auto-columns, and the grid-auto-flow properties
+ grid-area	
  Either specifies a name for the grid item, or this property is a shorthand property for the grid-row-start, grid-column-start, grid-row-end, and grid-column-end properties
+ grid-auto-columns	
  Specifies a default column size
+ grid-auto-flow	
  Specifies how auto-placed items are inserted in the grid
+ grid-auto-rows	
  Specifies a default row size
+ grid-column	
  A shorthand property for the grid-column-start and the grid-column-end properties
+ grid-column-end	
  Specifies where to end the grid item
+ grid-column-gap	
  Specifies the size of the gap between columns
+ grid-column-start	
  Specifies where to start the grid item
+ grid-gap	
  A shorthand property for the grid-row-gap and grid-column-gap properties
+ grid-row	
  A shorthand property for the grid-row-start and the grid-row-end properties
+ grid-row-end	
  Specifies where to end the grid item
+ grid-row-gap	
  Specifies the size of the gap between rows
+ grid-row-start	
  Specifies where to start the grid item
+ grid-template	
  A shorthand property for the grid-template-rows, grid-template-columns and grid-areas properties
+ grid-template-areas	
  Specifies how to display columns and rows, using named grid items
+ grid-template-columns	
  Specifies the size of the columns, and how many columns in a grid layout
+ grid-template-rows	
  Specifies the size of the rows in a grid layout
  row-gap	Specifies the gap between the grid rows





