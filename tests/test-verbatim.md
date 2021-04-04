test-verbatim

"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum."

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
# define input range
x = linspace(0,n,n+1);
y = x;
# generate plot
figure;
hold on;
plot(x, arrayfun(fx,x));
plot(y, arrayfun(fy,y), "1");
hold off;
print -dpng "-S640,480" plot.png
```


