var templater = require('tiny-templater'),
    dotpather = require('dotpather'),
    regex = /{%\s*([\w\d\s\-\.]*)\s*%}/;

function Parser(tags, template) {

  this.tags = tags;
  this.finalParts = [];
  this.position = 0;
  this.template = template;

}

Parser.prototype.parse = function (obj) {
  if (true) {
  }
}

Parser.prototype.lookup = dotpather;

Parser.prototype.render = function doRender(obj) {
  
  var hasStatement = this.template.substring(this.position).match(regex);

  if (!hasStatement) {
    return this.finalParts.join('');
  }
  var nextStatement = hasStatement[1],
      nextTag = nextStatement.split(/\s+/)[0];

  if (this.tags.indexOf(nextTag) !== -1) {
    var piece = this.tags[nextTag](parser, nextStatement);
    this.finalPieces.push(piece(obj));
  }

  doRender(obj);

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

