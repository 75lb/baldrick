[![view on npm](http://img.shields.io/npm/v/baldrick.svg)](https://www.npmjs.org/package/baldrick)
![npm module downloads per month](http://img.shields.io/npm/dm/baldrick.svg)
[![Dependency Status](https://david-dm.org/75lb/baldrick.svg)](https://david-dm.org/75lb/baldrick)

** work in progress ** 

baldrick
========
Do boring, repetitive work you can't be arsed to do.. 

Example
-------
```sh
$ baldrick --do 'jsdoc lib/' --when lib/*.js --change
lib/handbrake-js.js changed
✔︎ work done
```

```sh
$ baldrick --do 'cat aksjdnfkln' --when lib/*.js --change
lib/handbrake-js.js changed
✖ fucked up
Command failed: cat: ksjd: No such file or directory

output
cat: ksjd: No such file or directory
```
