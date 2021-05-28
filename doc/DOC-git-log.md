---
title: Showing Commit Points
---


    git log -p filename

to let git generate the patches for each log entry.

    git log --follow -p -- path-to-file

This will show the entire history of the file (including history
beyond renames and with diffs for each change).

In other words, if the file named bar was once named foo, then git log
-p bar (without the --follow option) will only show the file's history
up to the point where it was renamed -- it won't show the file's
history when it was known as foo. Using git log --follow -p bar will
show the file's entire history, including any changes to the file when
it was known as foo. The -p option ensures that diffs are included for
each change.

For this I'd use:

    gitk [filename]

or to follow filename past renames

    gitk --follow [filename]
