[![view on npm](http://img.shields.io/npm/v/baldrick.svg)](https://www.npmjs.org/package/baldrick)
![npm module downloads per month](http://img.shields.io/npm/dm/baldrick.svg)
[![Dependency Status](https://david-dm.org/75lb/baldrick.svg)](https://david-dm.org/75lb/baldrick)

** work in progress ** 

baldrick
========
Your own private dogsbody. Does the shitty work you can't be arsed to do.

install
-------
With [node.js](http://nodejs.org) installed, run:
```sh
$ npm install -g baldrick
```
*Mac / Linux users may need to run the above with `sudo`*.

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
