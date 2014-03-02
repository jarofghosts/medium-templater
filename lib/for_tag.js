module.exports = function(parser, contents) { 
  var bits = contents.split(/\s+/)
    , context_target = bits[1]
    , lookup = parser.lookup(bits[3])
    , flip = bits[4] && bits[4] === 'reversed'
    , for_body
    , empty_body

  parser.parse({
      'endfor': endfor
    , 'empty': empty
  })

  return function(context) {
    var target = lookup(context)
      , output = []
      , loop_context

    if(!target || !target.length) {
      return empty_body ? empty_body(context) : ''
    }

    if (flip) target = target.reverse()

    for(var i = 0, len = target.length; i < len; ++i) {
      loop_context = Object.create(context)
      loop_context[context_target] = target[i]
      loop_context.forloop = {
          parent: loop_context.forloop
        , index: i
        , isfirst: i === 0
        , islast: i === len - 1
        , length: len
      }

      output.push(for_body(loop_context))
    }

    return output.join('')
  }
 
  function empty(tpl) {
    for_body = tpl
    parser.parse({'endfor': endfor})
  }

  function endfor(tpl) {
    if(for_body) {
      empty_body = tpl
    } else {
      for_body = tpl
    }
  }
}
