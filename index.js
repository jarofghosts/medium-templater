var templater = require('tiny-templater')
  , dotpather = require('dotpather')
  , regex = /{%\s*([\w\d\s\-\.]*)\s*%}/

module.exports = language

function Parser(tags, template) {
  this.tags = tags
  this.final_parts = []
  this.position = 0
  this.template = template

  return this
}

Parser.prototype.parse = function Parser$parse(obj) {
  var end_tags = Object.keys(obj)
    , tag_rex = new RegExp('{%\\s*(' + end_tags.join('|') + ')\\s*%}')
    , has_tag = tag_rex.exec(this.template.slice(this.position))

  var sub_parser
    , tag_name
    , tpl

  if (!has_tag) return

  tag_name = has_tag[1]
  sub_parser = language(this.tags)

  tpl = sub_parser(
      this.template.slice(this.position, this.position + has_tag.index)
  )

  this.position += has_tag.index + has_tag[0].length
  obj[tag_name](tpl)
}

Parser.prototype.lookup = dotpather

Parser.prototype.render = function Parser$render(obj, clear) {
  var next_statement
    , has_statement
    , next_tag
    , compiled
    , piece

  if (clear !== undefined) {
    this.final_parts = []
    this.position = 0
  }
  
  has_statement = this.template.slice(this.position).match(regex)

  if (!has_statement) {
    if (!(this.final_parts[0] && this.final_parts[0].length === this.template.length)) {
      this.final_parts.push(this.template.slice(this.position))
    }
    compiled = templater(this.final_parts.join(''))

    return compiled(obj)
  }

  next_statement = has_statement[1]
  next_tag = next_statement.split(/\s+/)[0]

  if (this.tags[next_tag]) {
    if (this.position === 0 && has_statement.index > 0) {
      this.final_parts.push(this.template.slice(0, has_statement.index))
    }

    this.position += has_statement.index + has_statement[0].length
    piece = this.tags[next_tag](this, next_statement)
    this.final_parts.push(piece(obj))
  } else {
    this.position += has_statement.index + has_statement[0].length
  }

  return this.render(obj)
}

function language(tags) {
  return function (template) {
    var parser = new Parser(tags, template)

    return function (obj) {
      return parser.render(obj, true)
    }
  }
}
