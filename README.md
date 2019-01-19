# icc-parser

This package parses Index Card Collection (.icc) files into an ICCDocument object.

```js
const parse = require('icc-parser').default;
const str = require('fs').readFileSync('somefile.icc','utf8');

const parsed = parse(str);

console.log(parsed);
```