module.exports = function(parser, contents) {
  var bits = contents.split(/\s+/),
      lookupContextVariable = parser.lookup(bits[1]);

  parser.parse({
    'endif': endif,
    'else': if_else
  });

  function endif(tpl) {
  }

  function if_else(tpl) {
  }
}
