# icc-parser

This package parses Index Card Collection (.icc) files into an `ICCDocument` object.

```js
const parser = require('icc-parser');
const fs = require('fs')

const str = fs.readFileSync('somefile.icc','utf8');

const parsed = parser.parseICC(str);

console.log(JSON.stringify(parsed, undefined, 2));
```

Which would print:

```json
{
  "metaInformation": [
    {
      "field": "Version",
      "value": "1"
    },
    {
      "field": "Name",
      "value": "Jellyfish"
    }
  ],
  "cards": [
    {
      "front": "Jellyfish scientific name",
      "back": "Jellyfisch is the informal name for the medusa phase of certain gelatinous members of the subphylum Medusozoa"
    },
    {
      "front": "when did Jellyfisch came into existence",
      "back": "About 500 million years and possibly 700 million years."
    }
  ]
}
```

## ICC language

The ICC language is used to describe index card collections. Those collections are made up by meta fields and several index cards.
Index cards are real world cards with a front and a backside.


```
ICC-Version: 1
ICC-Name: Jellyfish

Front:

Jellyfish scientific name

Back:

Jellyfisch is the informal name for the medusa phase of certain gelatinous members of the subphylum Medusozoa

Front:

when did Jellyfisch came into existence

Back:

About 500 million years and possibly 700 million years.
```