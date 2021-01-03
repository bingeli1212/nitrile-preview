---
title: The PLST block
latex.parskip: 1
---

The PLST block is designed to contain the entire
content that might consists of multiple itemized
or enumerated items as well as paragraphs attached
to any one of the items.

In order to be recognized as the start of a PLST block,
the first line of a markdown paragraph must start
with a hyphen, an asterisk, or a plus-sign, followed
by one or more spaces. Alternatively, it can also start
with two or more digits, followed by a period, and then
one or more spaces. Instead of two or more digits, it can
also with an ASCII letter lower case 'a' through 'z', 
or capital letter 'A' through 'Z'. 

This block is to start from a source paragraph where
the first line is not indented and it starts with 
a hyphen-minus, a plus-sign, or a asterisk. 
These are called the "bullet"

If the "bullet" is a plus-sign, then the item is recognied
to be a "data term" for an item in a "description list".
Following is an example of a "description list".

~~~~framed
+ Elements

  Each group is a set with elements.

+ Group operation

  A group is associated with an binary operation that involves
  two elements in the group; this operation is called
  the &em{group operation}. Each group might have a unique
  operation that is different than other groups, which includes
  but not limited to addition, multiplication, and others.

+ Closure

  In order for a group to be called a group
  the group must exhibit the behavior called
  &em{closure}, which is defined as
  a behavior such that for any two elements
  \(x\) and \(y\) in the group, the result of the
  group operation \(x \ast y\) must also be another 
  element in the same group.
~~~~

If the "bullet" is a hyphen-minus, then each item is recognized
as an item of a "unordered list". Following is an example 
of an "unordered list".

~~~~framed
- First of all, a group is a set of numbers;

- Second, we pick an operation that is associated with this group;
  for example, we could define the operation as the addition, 
  but we could also pick multiplication, or others;

- Third, all elements of this group must be &b{closed} under the
  operation we have picked, for example, if the operation is addition,
  then adding any two numbers in the group the result will also be a
  member of that group
~~~~

If the "bullet" is a asterisk, then each item is recognized 
as an item of a "ordered list". Following is an example of 
an "ordered list".

~~~~framed
* the group of integers under addition \((\integers,+)\) 

* the group of one of the groups of
  integers modulo \(n\) \((\integers/n\integers,+)\) 

* any direct sum of finitely many finitely generated abelian 
  groups is again a finitely generated abelian group;
  every lattice forms a finitely generated free abelian group
~~~~

Note that each item must be separated with the other item by 
at least one blank line, except for the exception is the toplevel list,
where it is permissible for items to be specified together without
blank lines between them. However, in this case all "bullets" must
start at the first column.

Another alternative is to specify a list using custom bullet items.
This bullet items can only be a uppercase letter, a lowercase letter,
one or more digits. All of them must be followed by a period and then
at least one white space. Following is an example of using digits
as custom bullets.

~~~~framed
1. Typically the first element in the header row and the header
  column is the identity element; if this is the case, the first
  row and first column is exactly the same as the header row
  and header column;

2. In each row and each column there should be one and only one
  identity element---this is because each element in the group
  should have only one inverse element and operation of which
  is the identity element;

3. If the group is also Abelian, then the multiplication
  table is symmetric about the diagonal; however, if the
  group is non-Abelian, then the elements will be be symmetric
  across the diagonal; note that it is assume that each element
  of the table is always the result of multiplying the element in the
  header row with the element in the header column;
~~~~

Following is an example using lowercase letters.

~~~~framed
a. Typically the first element in the header row and the header
  column is the identity element; if this is the case, the first
  row and first column is exactly the same as the header row
  and header column;

b. In each row and each column there should be one and only one
  identity element---this is because each element in the group
  should have only one inverse element and operation of which
  is the identity element;

c. If the group is also Abelian, then the multiplication
  table is symmetric about the diagonal; however, if the
  group is non-Abelian, then the elements will be be symmetric
  across the diagonal; note that it is assume that each element
  of the table is always the result of multiplying the element in the
  header row with the element in the header column;
~~~~

Following is an example using uppercase letters.

~~~~framed
A. Typically the first element in the header row and the header
  column is the identity element; if this is the case, the first
  row and first column is exactly the same as the header row
  and header column;

B. In each row and each column there should be one and only one
  identity element---this is because each element in the group
  should have only one inverse element and operation of which
  is the identity element;

C. If the group is also Abelian, then the multiplication
  table is symmetric about the diagonal; however, if the
  group is non-Abelian, then the elements will be be symmetric
  across the diagonal; note that it is assume that each element
  of the table is always the result of multiplying the element in the
  header row with the element in the header column;
~~~~

Regardless of whether a custom bullet is used, 
each item can also be followed by optional paragraphs. 

~~~~framed
- First of all, a group is a  set of numbers;

  G = {1, 2, 3}

- Second, we pick an operation that is associated with this group;
  for example, we could define the operation as the addition, 
  but we could also pick multiplication, or others;

  ```
  (G,+) = {1, 2, 3}
  ```

- Third, all elements of this group must be &b{closed} under the
  operation we have picked, for example, if the operation is addition,
  then adding any two numbers in the group the result will also be a
  member of that group
~~~~

The paragraph would not have had the pattern of starting with a hyphen-minus,
plus-sign, or an asterisk, because otherwise it would have been recognized
as an item, rather than a paragraph. 

The paragraph can be of any regular paragraphs. If a paragraph is to have
blank lines, a paragraph-fence should have been used.

~~~~framed
- Third, all elements of this group must be &b{closed} under the
  operation we have picked, for example, if the operation is addition,
  then adding any two numbers in the group the result will also be a
  member of that group

  ~~~
  ```
  (G,+) = {1, 2, 3}

  (G,*) = {1, 2, 3}
  ```
  ~~~
~~~~
