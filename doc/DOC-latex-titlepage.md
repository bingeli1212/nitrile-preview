---
title: Writing a title page
---

# Writing a title page

Folloing is an example from overleaf.

    \begin{titlepage}
       \begin{center}
           \vspace*{1cm}
           \textbf{Thesis Title}
           \vspace{0.5cm}
            Thesis Subtitle
           \vspace{1.5cm}
           \textbf{Author Name}
           \vfill
           A thesis presented for the degree of\\
           Doctor of Philosophy
           \vspace{0.8cm}
           \includegraphics[width=0.4\textwidth]{university}
           Department Name\\
           University Name\\
           Country\\
           Date
       \end{center}
    \end{titlepage}

Now in the main .tex file we can replace the \maketitle command with an input
command linked to our new title page. If we now compile the code we can see all
the items have been correctly processed:
