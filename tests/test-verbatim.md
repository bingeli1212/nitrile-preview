test-verbatim

# Slide 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

```verbatim
# define fx and g1x
fx = @(x) poisspdf(x, n*p);
g1x = @(x) 5;
# define root x1
x1 = @(y) y/5;
# define fy
fy = @(y) fx(x1(y))/abs(g1x(x1(y)));
# define n and p
n = 1000
p = 0.05
```


