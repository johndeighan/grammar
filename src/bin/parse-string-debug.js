// parse-string-debug.coffee
var ans, err, iterator, next, parser, rl, stringToParse;

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
  OL
} from '@jdeighan/llutils';

import {
  slurp
} from '@jdeighan/llutils/fs';

import * as lib from '@jdeighan/grammar';

Object.assign(global, lib);

import {
  hExprAST
} from '../../test/grammar/grammars.js';

stringToParse = process.argv[2] || 'a*a';

LOG(`PARSING: ${OL(stringToParse)}`);

// ---------------------------------------------------------------------------
parser = new EarleyParser(hExprAST);

LOG(parser.asString());

iterator = parser.parse_generator(stringToParse, 'debug');

try {
  while (true) {
    ans = (await rl.question('> '));
    switch (ans) {
      case 'q':
        LOG('quitting...');
        process.exit();
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
    LOG(`ERROR: ${err.message}`);
  }
  process.exit();
}

//# sourceMappingURL=parse-string-debug.js.map
