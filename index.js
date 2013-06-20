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

  var position = this.position;

  Object.keys(obj).forEach(function (tag) {
    var tagRegex = new RegExp('{%\\s*' + tag + '\\s*%}'),
        hasTag = tagRegex.exec(this.template.substring(position));
    if (hasTag) {
      var subParser = language(this.tags),
          tpl = subParser(this.template.substring(position, position + hasTag.index));
      if (position + hasTag.index > this.position) { this.position = position + hasTag.index + hasTag[0].length; }
      obj[tag](tpl);
    }
  }.bind(this));

}

Parser.prototype.lookup = dotpather;

Parser.prototype.render = function (obj) {
  
  var hasStatement = this.template.substring(this.position).match(regex);

  if (!hasStatement) {
    this.finalParts.push(this.template.substring(this.position));
    var compiled = templater(this.finalParts.join(''));
    return compiled(obj);
  }

  var nextStatement = hasStatement[1],
      nextTag = nextStatement.split(/\s+/)[0];

  if (this.tags[nextTag]) {
    if (this.position === 0 && this.template.indexOf(hasStatement[0]) > 0) { this.finalParts.push(this.template.substring(0, this.template.indexOf(hasStatement[0]))); }
    this.position += this.template.indexOf(hasStatement[0]) + hasStatement[0].length;
    var piece = this.tags[nextTag](this, nextStatement);
    this.finalParts.push(piece(obj));
  } else {
    this.position = this.template.indexOf(nextStatement[0]) + nextStatement[0].length;
  }

  return this.render(obj);

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

