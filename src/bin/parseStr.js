#!/usr/bin/env node
// parseStr.coffee
var err, parser, result, stringToParse;

import {
  undef,
  defined,
  notdefined,
  LOG,
  OL
} from '@jdeighan/llutils';

import {
  slurp
} from '@jdeighan/llutils/fs';

import * as lib from '@jdeighan/grammar';

Object.assign(global, lib);

import {
  hSimpleAST
} from '@jdeighan/grammar/grammars';

stringToParse = process.argv[2] || 'a*a';

// ---------------------------------------------------------------------------
LOG(`PARSING: ${OL(stringToParse)}`);

parser = new EarleyParser(hSimpleAST);

LOG(parser.asString());

try {
  result = parser.parse(stringToParse);
  LOG(`\nRESULT: ${OL(result)}`);
} catch (error) {
  err = error;
  if (err instanceof SyntaxError) {
    LOG(`Syntax Error: ${err.message}`);
  } else {
    LOG(`ERROR: ${err.message}`);
  }
}

//# sourceMappingURL=parseStr.js.map