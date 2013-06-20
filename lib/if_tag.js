module.exports = function(parser, contents) {
  var bits = contents.split(/\s+/),
      lookupContextVariable = parser.lookup(bits[1]),
      ifBody,
      trueBody;

  parser.parse({
    'else': if_else,
    'endif': endif
  });

  return function (context) {
    var test = !!lookupContextVariable(context);
    
    if (test) {
      return trueBody(context);
    } else {
      return falseBody ? falseBody(context) : '';
    }
  }

  function endif(tpl) {
    if (trueBody) {
      falseBody = tpl;
    } else {
      trueBody = tpl;
    }
  }

  function if_else(tpl) {
    trueBody = tpl;
    parser.parse({ 'endif': endif });
  }
}
