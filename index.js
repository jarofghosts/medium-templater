var templater = require('tiny-templater'),
    dotpather = require('dotpather'),
    regex = /{%\s*([\w\d\s\-\.]*)\s*%}/;

function Parser(tags, template) {
  
  
}

Parser.prototype.parse = function (obj) {

}

Parser.prototype.lookup = dotpather;

Parser.prototype.render = function (obj) {
  
}

function language(tags) {

  return function (template) {

    var parser = new Parser(tags, template);

    return function (obj) {

      return parser.render(obj);

    }

  }

}

module.exports = language;

