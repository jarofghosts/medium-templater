medium-templater
====

[![Build Status](https://travis-ci.org/jarofghosts/medium-templater.png?branch=master)](https://travis-ci.org/jarofghosts/medium-templater)

It's like a tiny-templater but with a little dash of logic.

## usage

```js
var language = require('medium-templater')

var template_string
  , template
  , compile
  
template_string =
    '<ul>' +
    '{% for item in items %}' +
    '<li>{% if item.okay %}okay{% else %}not okay{% endif %}</li>' +
    '{% endfor %}' +
    '</ul>' +
    '{{ message }}'

compile = language()

template = compile(template_string)

var result = template({
    items: [{okay: true}, {okay: false}]
  , message: 'hello world'
})

console.log(result) // <ul><li>okay</li><li>not okay</li></ul>hello world
```

## extending

Though you get `if` and `for` for free, you can also provide your own tags
(or override the defaults if you don't like how they work!) like so:

#### `index.js`
```js
var language = require('medium-templater')
  , reverse = require('./lib/reverse')

language({
    reverse: reverse
})
```

#### `./lib/my_tag.js`
```js
module.exports = reverse

function reverse(parser, tag_options) {
  var contents = ''

  parser.parse({'endreverse': end_reverse})

  return function(context) {
    // context is what is passed to the template, irrelevant in this example.
    return contents().split('').reverse().join('')
  }

  function end_reverse(tpl) {
    contents = tpl
  }
}
```

now you can:

```html
{% reverse %}
!sredner etalpmet eht nehw thgir eb lliw txet siht
{% endreverse %}
```

## further options

Specifying `reversed` at the end of a for statement
(ie `for item in items reversed`) will parse the items in reverse. Specifying
an `{% empty %}` tag after the `{% for ... %}` will return that chunk in the
event of no items.

## license

MIT
