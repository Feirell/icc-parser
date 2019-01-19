const parse = require('.').default;
const str = require('fs').readFileSync('../../Dropbox/Karteikarten/pk2-01.icc');

const parsed = parse(str);

console.log(parsed);