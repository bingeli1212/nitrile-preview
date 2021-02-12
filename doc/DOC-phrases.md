---
title: Phrases
---

Each phrase is to appear in the form of a ampersand, followed by a
word, and then immediately with space a set of parenthesis with
text in it. Following are defined phrases.

- link-phrase
- ref-phrase

# The link-phrase

The link-phrase is used to typeset a link.

    Please visit link of &link(http://www.yahoo.com) for more information.

# The ref-phrase

The ref-phrase is designed to typeset a reference to another part of
the same document, which has been previous set by a label-style.

    ~~~figure{label:fig1}
    ~~~

    Please see figure &ref(fig1) for more information.

