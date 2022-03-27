---
title: 0160 - Modular Arithmetic
subtitle: Number Theory
peek: slide
---

# split listing                    

.listing{split:40}
\\
```
#include <stdio.h>
int main() {
   int i, j;
   char input, alphabet = 'A';
   printf("Enter an uppercase character you want to print in the last row: ");
   scanf("%c", &input);
   for (i = 1; i <= (input - 'A' + 1); ++i) {
      for (j = 1; j <= i; ++j) {
         printf("%c ", alphabet);
      }
      ++alphabet;
      printf("\n");
   }
   return 0;
}
int main() {
   int i, j;
   char input, alphabet = 'A';
   printf("Enter an uppercase character you want to print in the last row: ");
   scanf("%c", &input);
   for (i = 1; i <= (input - 'A' + 1); ++i) {
      for (j = 1; j <= i; ++j) {
         printf("%c ", alphabet);
      }
      ++alphabet;
      printf("\n");
   }
   return 0;
}
int main() {
   int i, j;
   char input, alphabet = 'A';
   printf("Enter an uppercase character you want to print in the last row: ");
   scanf("%c", &input);
   for (i = 1; i <= (input - 'A' + 1); ++i) {
      for (j = 1; j <= i; ++j) {
         printf("%c ", alphabet);
      }
      ++alphabet;
      printf("\n");
   }
   return 0;
}
int main() {
   int i, j;
   char input, alphabet = 'A';
   printf("Enter an uppercase character you want to print in the last row: ");
   scanf("%c", &input);
   for (i = 1; i <= (input - 'A' + 1); ++i) {
      for (j = 1; j <= i; ++j) {
         printf("%c ", alphabet);
      }
      ++alphabet;
      printf("\n");
   }
   return 0;
}
```

sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
minim veniam, quis nostrud exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.


# Split table        

.table{frame,rules:all,head:1,split:10 30}
\\
```
First\\Last
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
```

# Single listing

.listing
\\
```
#include <stdio.h>
int main() {
   int i, j;
   char input, alphabet = 'A';
   printf("Enter an uppercase character you want to print in the last row: ");
   scanf("%c", &input);
   for (i = 1; i <= (input - 'A' + 1); ++i) {
      for (j = 1; j <= i; ++j) {
         printf("%c ", alphabet);
      }
      ++alphabet;
      printf("\n");
   }
   return 0;
}
```


# Single table

.table{frame,rules:all}
\\
```
First\\Last
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
Jane\\Fonda
```



