var language = require('../index.js'),
    for_tag = require('../lib/for_tag.js'),
    template = '<ul>{% for item in items %}<li>{{ item.name }}</li>{% endfor %}</ul>';

var compile = language({
  'for': for_tag
});

var view = compile(template);

console.log(view({items: [{ name: 'hey'} , { name: 'there' }, { name: 'you' }] }));
