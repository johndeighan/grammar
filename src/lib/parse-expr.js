// parse-expr.coffee
var grammarStr;

import {
  undef,
  defined,
  notdefined,
  LOG,
  OL,
  assert,
  croak
} from '@jdeighan/llutils';

import {
  EarleyParser
} from '@jdeighan/grammar';

// ---------------------------------------------------------------------------
grammarStr = `E -> E + T
E -> T
T -> T * P
T -> P
P -> a`;

// ---------------------------------------------------------------------------
export var parseExpr = (str) => {
  var parser;
  parser = new EarleyParser(grammarStr);
  return parser.parse(str);
};

//# sourceMappingURL=parse-expr.js.map
