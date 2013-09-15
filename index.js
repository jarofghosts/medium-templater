var templater = require('tiny-templater'),
    dotpather = require('dotpather'),
    regex = /{%\s*([\w\d\s\-\.]*)\s*%}/;

function Parser(tags, template) {
  this.tags = tags;
  this.finalParts = [];
  this.position = 0;
  this.template = template;

  return this;
}

Parser.prototype.parse = function (obj) {

  var endTags = Object.keys(obj),
      tagRegex = new RegExp('{%\\s*(' + endTags.join('|') + ')\\s*%}'),
      hasTag = tagRegex.exec(this.template.substring(this.position));
    if (hasTag) {
      var subParser = language(this.tags),
          tpl = subParser(this.template.substring(this.position, this.position + hasTag.index));
      this.position += hasTag.index + hasTag[0].length;
      obj[hasTag[1]](tpl);
    }

}

Parser.prototype.lookup = dotpather;

Parser.prototype.render = function (obj, clear) {

  if (clear !== undefined) {
    this.finalParts = [];
    this.position = 0;
  }
  
  var hasStatement = this.template.substring(this.position).match(regex);
  if (!hasStatement) {
    if (!(this.finalParts[0] && this.finalParts[0].length === this.template.length)) {
      this.finalParts.push(this.template.substring(this.position));
    }
    var compiled = templater(this.finalParts.join(''));
    return compiled(obj);
  }

  var nextStatement = hasStatement[1],
      nextTag = nextStatement.split(/\s+/)[0];

  if (this.tags[nextTag]) {
    if (this.position === 0 && hasStatement.index > 0) { this.finalParts.push(this.template.substring(0, hasStatement.index)); }
    this.position += hasStatement.index + hasStatement[0].length;
    var piece = this.tags[nextTag](this, nextStatement);
    this.finalParts.push(piece(obj));
  } else {
    this.position += hasStatement.index + hasStatement[0].length;
  }

  return this.render(obj);

}

function language(tags) {

  return function (template) {

    var parser = new Parser(tags, template);

    return function (obj) {

      return parser.render(obj, true);

    }

  }

}

module.exports = language;

