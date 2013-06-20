var language = require('../index.js'),
    for_tag = require('../lib/for_tag.js'),
    if_tag = require('../lib/if_tag.js'),
    assert = require('assert'),
    template = ['<ul>',
               '{% for item in items %}',
               '<li>{% if item.okay %}it\'s okay{% else %}it\'s not okay{% endif %}</li>',
               '{% endfor %}',
               '</ul>',
               '{{ message }}'];

var compile = language({
  'for': for_tag,
  'if': if_tag
});

var view = compile(template.join('')),
    firstObj = { items: [{ okay: true } , { okay: false }], message: 'hello world' };

// satisfy initial conditions
assert.equal(view(firstObj), '<ul><li>it\'s okay</li><li>it\'s not okay</li></ul>hello world');

template[1] = '{% for item in items reversed %}';

view = compile(template.join(''));

// test reversed
assert.equal(view(firstObj), '<ul><li>it\'s not okay</li><li>it\'s okay</li></ul>hello world');

view = compile('{{ test }} wee');

// test no issue when run with no tags
assert.equal(view({ test: 'woo' }), 'woo wee');

view = compile('hey');

// test returns normal string unmodified
assert.equal(view({}), 'hey');

view = compile('{% for cat in cats %}{%if cat.hasAHat %}{{ cat.name }} {% endif %}{% empty %}no cats{% endfor %}');
// test {% empty %} syntax
assert.equal(view({}), 'no cats');

// test conditional with undefined and no else body
assert.equal(view({ cats: [{ name: 'heathcliff', hasAHat: false }, { name: 'top cat', hasAHat: true }, { name: 'garfield' }, { name: 'cat in the hat', hasAHat: true }] }), 'top cat cat in the hat ');

view = compile('{% for item in items %}item{% endfor %}{% for cat in cats %}cat{% endfor %}');

// test multiple tags in one template
assert.equal(view({ cats: [1, 2], items: [1, 2, 3] }), 'itemitemitemcatcat');
