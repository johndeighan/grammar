#!/usr/bin/env node
// debugStr.coffee
var _, ans, err, go, iterator, next, parser, rl, stringToParse;

import * as readline from 'node:readline/promises';

import {
  stdin,
  stdout
} from 'node:process';

rl = readline.createInterface({
  input: stdin,
  output: stdout,
  terminal: true
});

import {
  undef,
  defined,
  notdefined,
  LOG,
  OL,
  nonEmpty
} from '@jdeighan/llutils';

import {
  getArgs
} from '@jdeighan/llutils/cmd-args';

import {
  slurp
} from '@jdeighan/llutils/fs';

import * as lib from '@jdeighan/grammar';

Object.assign(global, lib);

import {
  hSimpleAST
} from '@jdeighan/grammar/grammars';

({
  _,
  g: go
} = getArgs({
  _: {
    min: 0,
    max: 1 // string to parse
  },
  g: {
    type: 'boolean'
  }
}));

stringToParse = nonEmpty(_) ? _[0] : 'a+a';

LOG(`PARSING: ${OL(stringToParse)}`);

// ---------------------------------------------------------------------------
parser = new EarleyParser(hSimpleAST);

LOG(parser.asString());

iterator = parser.parse_generator(stringToParse, 'debug');

try {
  while (true) {
    if (go) {
      ans = undef;
    } else {
      ans = (await rl.question('> '));
    }
    switch (ans) {
      case 'q':
        LOG('quitting...');
        process.exit();
        break;
      case 'go':
      case 'g':
        go = true;
        break;
      default:
        next = iterator.next();
        if (next.done) {
          LOG(`\nRESULT: ${OL(next.value)}`);
          process.exit();
        }
    }
  }
} catch (error) {
  err = error;
  if (err instanceof SyntaxError) {
    LOG(`Syntax Error: ${err.message}`);
  } else {
    throw err;
  }
  process.exit();
}

//# sourceMappingURL=debugStr.js.map