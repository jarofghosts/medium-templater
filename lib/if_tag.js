module.exports = function(parser, contents) {
  var bits = contents.split(/\s+/)
    , lookup = parser.lookup(bits[1])
    , false_body
    , true_body

  parser.parse({
    'else': if_else,
    'endif': endif
  })

  return function if_tag(context) {
    var test = lookup(context)
    
    if (test) {
      return true_body(context)
    } else {
      return false_body ? false_body(context) : ''
    }
  }

  function endif(tpl) {
    if (true_body) {
      false_body = tpl
    } else {
      true_body = tpl
    }
  }

  function if_else(tpl) {
    true_body = tpl
    parser.parse({ 'endif': endif })
  }
}
