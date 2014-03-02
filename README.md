medium-templater
====

[![Build Status](https://travis-ci.org/jarofghosts/medium-templater.png?branch=master)](https://travis-ci.org/jarofghosts/medium-templater)

It's like a tiny-templater but with a little dash of logic.

## usage

```js
var language = require('medium-templater')
  , if_tag = require('./lib/if_tag.js')
  , for_tag = require('./lib/for_tag.js')
  , template_string
  , compile
  , template
  
template_string =
    '<ul>' +
    '{% for item in items %}' +
    '<li>{% if item.okay %}okay{% else %}not okay{% endif %}</li>' +
    '{% endfor %}' +
    '</ul>' +
    '{{ message }}'

compile = language({
    'if': if_tag
  , 'for': for_tag
})

template = compile(template_string)

var result = template({
    items: [{okay: true}, {okay: false}]
  , message: 'hello world'
})

console.log(result) // <ul><li>okay</li><li>not okay</li></ul>hello world
```

## further options

Specifying `reversed` at the end of a for statement
(ie `for item in items reversed`) will parse the items in reverse. Specifying
an `{% empty %}` tag after the `{% for ... %}` will return that chunk in the
event of no items.

## license

MIT
