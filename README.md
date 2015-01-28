w625
====

**[Deprecated]** ES6 repl with web page scope

## install

```sh
$ [sudo] npm i w625 -g
```

## usage

```sh
$ usage: w625 [-hV] [src] [--script=script]
```

## why ?

**6to5 NOW supports what this module intended to fix. DO NOT USE**

~~I wanted to use es6 ***NOW*** in a repl and couldn't find any solutions
out there. [6to5](https://github.com/sebmck/6to5) is great ! However, you
currently cannot maintain state in their repl implementation. See below
for an example:~~

```js
$ 6to5-node
> let foo = 123;
'use strict'
> console.log(foo);
ReferenceError: foo is not defined
    at repl:2:1
    at _eval (/usr/local/lib/node_modules/6to5/bin/6to5-node:40:13)
    at REPLServer.replEval [as eval] (/usr/local/lib/node_modules/6to5/bin/6to5-node:78:14)
    at Interface.<anonymous> (repl.js:239:12)
    at Interface.emit (events.js:95:17)
    at Interface._onLine (readline.js:202:10)
    at Interface._line (readline.js:531:8)
    at Interface._ttyWrite (readline.js:760:14)
    at ReadStream.onkeypress (readline.js:99:10)
    at ReadStream.emit (events.js:98:17)
```

## example

### using w625 as an es6 repl

```js
$ w625
dom> let curry = f => a => b => f(a, b)
undefined
dom> let add = curry((a, b) => a + b)
undefined
dom> let addTwo = add(2);
undefined
dom> addTwo(2)
4
```

### using w625 with a scoped webpage

```js
$ w625 http://littlstar.com
dom> Array.prototype.forEach.call(document.getElementsByTagName('a'), node => console.log(node.href))
https://littlstar.com/
https://littlstar.com/#home
https://littlstar.com/#about
https://littlstar.com/#contact-form
https://www.facebook.com/pages/Littlstar/505243059555239
https://twitter.com/littlstarmedia
https://plus.google.com/+Littlstar/posts
http://littlstar.com/
```

### using w625 with a scoped webpage and script

```js
$ w625 https://github.com --script=http://code.jquery.com/jquery.js
dom> void $('a').each((i, a) => console.log(a.href));
https://github.com/#start-of-content
https://github.com/
https://github.com/join
https://github.com/login
https://github.com/explore
https://github.com/features
https://enterprise.github.com/
https://github.com/blog
https://help.github.com/terms
https://help.github.com/privacy
https://github.com/plans
https://github.com/features
https://github.com/explore
https://github.com/integrations
https://central.github.com/mac/latest
http://mac.github.com/
...
```

## license

MIT

