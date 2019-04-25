FIT Support Infrastructure
==========================

After a request for FIT file support, I added did some digging as to what would be required for that, and the contents
of this directory are what I've come up with.

All of this is fairly experimental, but seems to work fine in both Chrome and Firefox (only browsers tested so far).
Please report any bugs that you find with FIT support. If you try and set this up yourself, you may find that setting
up the Emscripten environment is the hardest part, but they have pretty good docs on that. Good luck!

Let's go through the contents of this directory with some explanations:

CPP
---

The CPP directory contains a partial copy of the official [FIT SDK](https://www.thisisant.com/resources/fit/),
containing only the CPP resources with no examples.

Makefile
--------

The Makefile is used to build the CPP files into the JS library we use for fit support. This is done with
[Emscripten](https://emscripten.org), and will output two files: `decode.js` and `decode.wasm`.

bytebuf.(c|h)pp
---------------

These files are a wrapper around a simple `unsigned char*` to  use it as the data source for an `istream`, so that we
have a format we can pass in from plain JS to the standard FIT library. See
[this Stack Overflow question](https://stackoverflow.com/questions/7781898/get-an-istream-from-a-char) for the source
of this code.

decode.cpp
----------

This implements and exports code that accepts a `Uint8Array` from JavaScript, runs it through the standard FIT SDK
parsing functions, and outputs a plain text GPX file. This text file is then parsed into a DOM Document in JavaScript
exactly (well, nearly) as if the GPX file had been uploaded directly. This only attempts to extract basic data from the
FIT file - latitude, longitude, and time.
