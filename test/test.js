var language = require('../index.js'),
    for_tag = require('../lib/for_tag.js'),
    if_tag = require('../lib/if_tag.js'),
    template = '<ul>' +
               '{% for item in items reversed %}' + 
               '<li>{% if item.okay %}it\'s okay{% else %}it\'s not okay{% endif %}</li>' +
               '{% endfor %}' + 
               '</ul>' + 
               '{{ message }}';

var compile = language({
  'for': for_tag,
  'if': if_tag
});

var view = compile(template);

console.log(view({ items: [{ okay: true } , { okay: false }], message: 'hello world' }));
