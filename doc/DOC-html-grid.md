---
title: CSS Grid Layout Module
doc: page
---


# CSS Grid Layout Module

Following is a grid layout that works for showing a list of "cards" laid horizontally
across the page, with a caption at the top and a subtitle at the bottom for each image.

.sample

    <style>
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
    </style>
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
            
This should look like figure &ref{grid:gridlayout}.

.figure
&label{grid:gridlayout}
A div-element of two children, each of which is a 
article-element which itself arranges its children
in grids.

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

A element becomes a "grid container" when its
"display:grid" property is set as
such. 
The children of a grid container automatically
become "grid items". 



# The columns, rows & grid lines

The grid container, depending on its configuration, would
allocate spaces called "grids". All grids
arrange themselves into rows and column. 
For rows
we would consider the top row to be the first row, 
and last row as the one at the very bottom. 
For columns the first column is the one
all the way to the left, and the last column is the one 
to the far right,

The imaginary lines between two neighboring
rows and/or neighboring columns are called "grid lines".
The horizontal line on top of the first row and is named "1".
The line that sits between the first row and second row is named
"2", and so on.
The vertical line that is located to the left of the 
first column is named "1", and the line that sits between the first
column and the second column is named "2", and so on.
See figure &ref{grid:gridlines} for locations of grid lines.

.figure{subfigure}
  &label{grid:gridlines}
  Columns, rows and grid lines.

  Grid lines for columns.
  ```diagram{frame,viewport:14 14}
  origin ^x:1 ^y:1
  box {w:10,h:10} (0,0)
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 2
  box "grid" (1,7) [h:3] [h:3]
  box "grid" (1,4) [h:3] [h:3]
  box "grid" (1,1) [h:3] [h:3]
  draw {linedashed} (0.5,0)[v:11] 
  drawtext "1" &lastpt
  draw {linedashed} (3.5,0)[v:11]
  drawtext "2" &lastpt
  draw {linedashed} (6.5,0)[v:11]
  drawtext "3" &lastpt
  draw {linedashed} (9.5,0)[v:11]
  drawtext "4" &lastpt
  ```
  Grid lines for rows.
  ```diagram{frame,viewport:14 14}
  origin ^x:1 ^y:1
  box {w:10,h:10} (0,0)
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 2
  box "grid" (1,7) [h:3] [h:3]
  box "grid" (1,4) [h:3] [h:3]
  box "grid" (1,1) [h:3] [h:3]
  draw {linedashed} ^down:0.5 (0,10)[h:11]
  drawtext "1" (&lastpt)
  draw {linedashed} ^down:0.5 (0,7)[h:11]
  drawtext "2" (&lastpt)
  draw {linedashed} ^down:0.5 (0,4)[h:11]
  drawtext "3" (&lastpt)
  draw {linedashed} ^down:0.5 (0,1)[h:11]
  drawtext "4" (&lastpt)
  ```
    

# The "grid-gap" property

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
    
It would have the visual effect of figure &ref{grid:gridgap}.

.figure
  &label{grid:gridgap}
  The "grid-row-gap:50px" property has been set for the container.

  ```diagram{frame,viewport:18 5}
  config fillcolor gray
  config opacity 0.2
  config w 6
  config h 1
  box "1" (0,4) "2" [h:6] "3" [h:6]
  box "4" (0,2) "5" [h:6] "6" [h:6] 
  box "7" (0,0) "8" [h:6] "9" [h:6]
  ```
  
Similarly, the gap between columns are denoted by the 
"grid-column-gap". It is also possible state both the row gap
and column gap by the "grid-gap" property.

.sample 

  .grid-container {
    grid-column-gap: 50px;
  }

This should have a visual effect similar to figure &ref{grid:gridcolumngap}.

.figure
  &label{grid:gridcolumngap}
  The "grid-column-gap:50px" property has been set for the container.

  ```diagram{frame,viewport:17 3}
  config fillcolor gray
  config opacity 0.2
  config w 5
  config h 1
  box "1" (0,2) "2" [h:6] "3" [h:6]
  box "4" (0,1) "5" [h:6] "6" [h:6] 
  box "7" (0,0) "8" [h:6] "9" [h:6]
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



# The "grid-template-columns" and "grid-template-rows" properties

The "grid-template-columns" property is designed to
control the widths of 
each columns, as well as stating how many columns there are
in the grid.
The example above has been 
setting this property
as "grid-template-columns:auto auto auto". 
This states that the three columns should take up 
all the spaces of the content width of the grid container,
and each should get the equal amount of space.

It is also possible to specifically state the width
of each column individually. In the following example each
column has been set to a width that is 150px.

.sample

  <style>
  .grid-container {
    display: grid;
    grid-template-columns: 150px 150px 150px;
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

.figure
   The "grid-template-columns:150px 150px 150px" property 
   is set for the container. This forces each grid to get a 
   maximum width of 150px, leaving some spaces unfilled within
   the container after the last grid item of the row.

  ```diagram{frame,viewport:18 3}
  config fillcolor gray
  config opacity 0.2
  config w 3
  config h 1
  box "1" (0,2) "2" [h:3] "3" [h:3]
  box "4" (0,1) "5" [h:3] "6" [h:3] 
  box "7" (0,0) "8" [h:3] "9" [h:3]
  ```
  
The "grid-template-rows" property is used to control the height
of each row. 
The following is an example that sets the "grid-template-rows"
property so that the first row gets a height
of 50px, and the second row a height of 50px. The third
row and onwards are not specified and thus those rows are 
back to their native height. This should have a visual
effect of figure &ref{grid:rowheight}.

.sample

  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: 50px 100px;
  }

.figure
  &label{grid:rowheight}
  The property of "grid-template-rows:50px 100px" 
  is set.
  
  ```diagram{frame,viewport:18 7}
  config fillcolor gray
  config opacity 0.2
  config w 6
  config h 1
  box "1" {h:2} (0,5) "2" [h:6] "3" [h:6]
  box "4" {h:4} (0,1) "5" [h:6] "6" [h:6] 
  box "7" (0,0) "8" [h:6] "9" [h:6]
  ```



# The "justify-content" property

The "justify-content" property controls the item within
the grid if its content geometry is less than the available
geometry of the grid. For instance,
the value "space-evenly" will set is so that equal  
amount of space would be given to spaces between, and around them:

.sample

  <style>
  .grid-container {
    display: grid;
    justify-content: space-evenly;
    grid-template-columns: 100px 100px 100px;
  }
  .grid-container > div {
    text-align: center;
  }
  </style>  
  <body>
  <div class="grid-container">
    <div>1</div>
    <div>2</div>
    <div>3</div>  
    <div>4</div>
    <div>5</div>
    <div>6</div>  
  </div>
  </body>

This would have generated the following appearance.

.figure
  The "justify-content" property has been set to "space-evenly".

  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (3,1) "2" [h:5] "3" [h:5]
  box "4" (3,0) "5" [h:5] "6" [h:5]
  ```

.figure
  The "justify-content" property has been set to "space-around".
  
  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (2,1) "2" [h:6] "3" [h:6]
  box "4" (2,0) "5" [h:6] "6" [h:6]
  ```

.figure
  The "justify-content" property has been set to "space-between".
  
  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (0,1) "2" [h:8] "3" [h:8]
  box "4" (0,0) "5" [h:8] "6" [h:8]
  ```
  
.figure
  The "justify-content" property has been set to "center".
  
  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (6,1) "2" [h:2] "3" [h:2]
  box "4" (6,0) "5" [h:2] "6" [h:2]
  ```
    
.figure
  The "justify-content" property has been set to "start".
  
  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (0,1) "2" [h:2] "3" [h:2]
  box "4" (0,0) "5" [h:2] "6" [h:2]
  ```
   
.figure
  The "justify-content" property has been set to "end".
  
  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,1) "2" [h:2] "3" [h:2]
  box "4" (12,0) "5" [h:2] "6" [h:2]
  ```
     

# The "align-content" property

The "align-content" property is used to vertically 
align the whole grid inside the container.  
  
.figure
  The "align-content" property has been set to "end".
  
  ```diagram{frame,viewport:18 4}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,1) "2" [h:2] "3" [h:2]
  box "4" (12,0) "5" [h:2] "6" [h:2]
  ```
  
.figure
  The "align-content" property has been set to "start".
  
  ```diagram{frame,viewport:18 4}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,3) "2" [h:2] "3" [h:2]
  box "4" (12,2) "5" [h:2] "6" [h:2]
  ```  
  
.figure
  The "align-content" property has been set to "center".
  
  ```diagram{frame,viewport:18 4}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,2) "2" [h:2] "3" [h:2]
  box "4" (12,1) "5" [h:2] "6" [h:2]
  ```  

.figure
  The "align-content" property has been set to "space-evenly".
  
  ```diagram{frame,viewport:18 5}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,3) "2" [h:2] "3" [h:2]
  box "4" (12,1) "5" [h:2] "6" [h:2]
  ```  
  
.figure
  The "align-content" property has been set to "space-around".
  
  ```diagram{frame,viewport:18 6}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,4) "2" [h:2] "3" [h:2]
  box "4" (12,1) "5" [h:2] "6" [h:2]
  ```  
  
.figure
  The "align-content" property has been set to "space-between".
  
  ```diagram{frame,viewport:18 4}
  config fillcolor gray
  config opacity 0.2
  config w 2
  config h 1
  box "1" (12,3) "2" [h:2] "3" [h:2]
  box "4" (12,0) "5" [h:2] "6" [h:2]
  ```  
  
    
# Occupying two or more neighboring grids

It is possible for a grid item 
to occupy two or three neighboring grids.

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
  The "grid-column-start:2" and "grid-column-end:4" 
  properties are set for
  item 1.

  ```diagram{frame,viewport:18 4}
  config w 6
  config h 1
  config fillcolor gray
  config opacity 0.2
  box "1" {w:12} (6,3)
  box "2" (0,2) "3" [h:6] "4" [h:6]
  box "5" (0,1) "6" [h:6] "7" [h:6]
  box "8" (0,0) "9" [h:6] 
  ```

The same CSS properties above can be replaced by a single
CSS property that is follows, which states that the item 1 should
start at column line 2 and end at column line 4.

.sample
 
  .item1 {
    grid-column: 2 / 4;
  }  
  
It is also possible to express that column span instead of 
column end line number, such as the following.

.sample
 
  .item1 {
    grid-column: 2 / span 2;
  }  
  
This would have had the same effect as the previous example.
Similarly, the "grid-row" would have done the same thing except that
the merging of grids is going to happen vertically.

.sample

  .item1 {
    grid-row: 1 / 4;
  }
  
This would have had the following visual effect.

.figure
 The "grid-row:1/4" property is set for item 1.

  ```diagram{frame,viewport:18 4}
  config fillcolor gray
  config opacity 0.2
  config w 6
  config h 1
  box "1" {w:6,h:3} (0,1)
  box "2" (6,3) "3" [h:6]
  box "4" (6,2) "5" [h:6]
  box "6" (6,1) "7" [h:6]
  box "8" (0,0) "9" [h:6] 
  ```    

It is also possible to specify both the "grid-row" and "grid-column"
such that the same grid item would absorb neighboring grids not only
below but to the right at the same time.

.sample

  .item1 {
    grid-row: 1 / 4;
    grid-column: 1 / 3;
  }
  
This would have had the following visual effect.

.figure
 Both "grid-row:1/4" and "grid-column:1/3" are set.

  ```diagram{frame,viewport:18 5}
  config fillcolor gray
  config opacity 0.2
  config w 6
  config h 1
  box "1" {w:12,h:3} (0,2)
  box "2" (12,4)
  box "3" (12,3)
  box "4" (12,2)
  box "5" (0,1) "6" [h:6] "7" [h:6]
  box "8" (0,0) "9" [h:6] 
  ``` 

  
  
# The "grid-area" property

The "grid-area" property 
can be used as a shorthand property for the 
"grid-row-start","grid-column-start", "grid-row-end" 
and "grid-column-end" properties.

For instance, the following "grid-row-area" is equivalent
to the example above.

.sample

  .item1 {
    grid-area: 1 / 1 / 4 / 3;
  }

It can be seen that the first and the third arguments
corresponds to the two arguments of "grid-row", and the second
and fourth arguments correspond to the two arguments of "grid-column".
The same setting above can be repeated using 
the following form.

.sample

  .item1 {
    grid-area: 1 / 1 / span 3 / span 2;
  }

Instead of expressng the starting/stopping rows and column lines for a particular item,
the same "grid-area" property can also be assigned a text string
that would refer to an rectangle area area that might consist of one or more neighboring grids.
Each of these grid would have had names assigned to by the virtual of the "grid-template-areas" property
and they would all have the same name as that referred to by the "grid-area" property of the 
grid item.

Following is an example of a grid container where its "grid-template-areas"
property assigns the name "myArea" to the first two grids of the first row, and
the first two grids of the second row, such that if item 1 had set up its  
"grid-area:myArea" property this way it would end up taking up the entire area of these   
four grids. 

.sample

  .grid-container {
    grid-template-areas: 'myArea myArea . .' 'myArea myArea . .';
  }
  .item1 {
    grid-area: myArea;
  }
  
The previous example would have a visual effect similarly to the one shown
by figure &ref{grid:myarea}.

.figure
  &label{grid:myarea}
  Using "myArea".

  ```diagram{frame,viewport:24 3}
  config w 6
  config h 1
  config fillcolor gray
  config opacity 0.2
  box "1" {w:12,h:2} (0,1)
  box "2" (12,2) "3" [h:6]
  box "4" (12,1) "5" [h:6]
  box "6" (0,0) "7" [h:6] "8" [h:6] "9" [h:6]
  ``` 

Note that the syntax for "grid-template-areas" is as follows:

* Each row consists of a list of names and/or periods separated by spaces;
* Anything that is not a period is to be assumed as the name assigned to the grid at that location of the row;
* The text for describing the row must be surrounded by a set of apostrophies;
* The second row would have to be expressed similarly, and the entire row is to appear after the first row following one or more spaces;
* Each additional rows would be similarly expressed, and placed one after another in the same order as they appear within the container.

The rules that has been discussed about named grid areas allows for a complex grid to be designed relative easyly, especially when each grid item tends to occupy different set of neighboring grids.
The following example is designed to show case a complex grid layout where there are five grid items each of which has different requirements when it comes to occupying the neighboring grids.

.sample

  .item1 { grid-area: header; }
  .item2 { grid-area: menu; }
  .item3 { grid-area: main; }
  .item4 { grid-area: right; }
  .item5 { grid-area: footer; }
  .grid-container {
    grid-template-areas:
      'header header header header header header'
      'menu main main main right right'
      'menu footer footer footer footer footer';
  }  
  
.figure
  Using "header", "menu", "main", "right", and "footer" names.

  ```diagram{frame,viewport:24 3}
  config w 4
  config h 1
  config fillcolor gray
  config opacity 0.2
  box "header" {w:24,h:1} (0,2)
  box "menu"   {w:4,h:2}  (0,0)
  box "main"   {w:12}     (4,1)
  box "right"  {w:8}      (16,1)
  box "footer" {w:20}     (4,0)
  ``` 
  
  
# Re-ordering of items

Note that items are typically arranged in the order of 
filling out each row first before moving on to the 
first column of the next row. However, it is possible, 
given the "grid-area" settings of each item, such that 
these same items could appear "out of order", simply by
setting each item a different starting row column line.

For instance, the setting of the "grid-are" of the following
items would have had an impact as to where each grid item
appear within the grid.

.sample

  .item1 { grid-area: 1 / 3 / 2 / 4; }
  .item2 { grid-area: 2 / 3 / 3 / 4; }
  .item3 { grid-area: 1 / 1 / 2 / 2; }
  .item4 { grid-area: 1 / 2 / 2 / 3; }
  .item5 { grid-area: 2 / 1 / 3 / 2; }
  .item6 { grid-area: 2 / 2 / 3 / 3; }

.figure
  Items appear to have been "re-ordered" by the nature of having been 
  assigned different values of "grid-area" property.
  
  ```diagram{frame,viewport:18 2}
  config fillcolor gray
  config opacity 0.2
  config w 6
  config h 1
  box "3" (0,1) "4" [h:6] "1" [h:6]
  box "5" (0,0) "6" [h:6] "2" [h:6]
  ```
  
  
  
  
