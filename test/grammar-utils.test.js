// grammar-utils.test.coffee
var grammar, nRules, parser, ref, rule, rx, rx2, rx3, rx4, rx5;

import {
  undef,
  defined,
  notdefined
} from '@jdeighan/llutils';

import {
  terminal,
  nonterminal,
  RuleEx
} from '@jdeighan/grammar/rule-ex';

import * as lib2 from '@jdeighan/llutils/utest';

Object.assign(global, lib2);

import * as lib from '@jdeighan/grammar';

Object.assign(global, lib);

import {
  hSimpleAST
} from '@jdeighan/grammar/grammars';

// ---------------------------------------------------------------------------
//symbol RuleEx

// --- T -> T * P
rule = {
  type: "rule",
  head: "T",
  lParts: [nonterminal("T"), terminal("*"), nonterminal("P")]
};

rx = new RuleEx(rule, 0);

equal(rx.pos, 0);

rx2 = rx3 = rx4 = rx5 = undef;

succeeds(() => {
  return rx2 = rx.getInc();
});

equal(rx2.pos, 1);

succeeds(() => {
  return rx3 = rx2.getInc();
});

succeeds(() => {
  return rx4 = rx3.getInc();
});

equal(rx4.pos, 3);

fails(() => {
  return rx5 = rx4.getInc();
});

// ---------------------------------------------------------------------------
//symbol Grammar
grammar = undef;

succeeds(() => {
  return grammar = new Grammar(hSimpleAST);
});

truthy(grammar instanceof Grammar);

equal(grammar.getRule(2), rule);

equal(grammar.root(), "E");

equal(grammar.asString(), `E -> E + T
E -> T
T -> T * P
T -> P
P -> a`);

nRules = 0;

ref = grammar.alternatives("T");
for (rule of ref) {
  nRules = nRules + 1;
  equal(rule.head, "T");
}

equal(nRules, 2);

// ---------------------------------------------------------------------------
//symbol EarleyParser
parser = new EarleyParser(hSimpleAST);

succeeds(() => {
  return parser.parse("a");
});

succeeds(() => {
  return parser.parse("a+a");
});

succeeds(() => {
  return parser.parse("a*a");
});

succeeds(() => {
  return parser.parse("a+a");
});

succeeds(() => {
  return parser.parse("a+a*a");
});

succeeds(() => {
  return parser.parse("a*a+a");
});

fails(() => {
  return parser.parse("b");
});

fails(() => {
  return parser.parse("a+b");
});

fails(() => {
  return parser.parse("b*a");
});

fails(() => {
  return parser.parse("a++a");
});

fails(() => {
  return parser.parse("a+a**a");
});

fails(() => {
  return parser.parse("a*a+");
});

// ---------------------------------------------------------------------------
// create Grammar object from a string
(() => {
  grammar = new Grammar(astFromString(`E -> E + T
E -> T
T -> T * P
T -> P
P -> a`));
  return equal(grammar.asString(), `E -> E + T
E -> T
T -> T * P
T -> P
P -> a`);
})();

// ---------------------------------------------------------------------------
// create an EarleyParser object from a string
(() => {
  parser = new EarleyParser(`E -> E + T
E -> T
T -> T * P
T -> P
P -> a`);
  succeeds(() => {
    return parser.parse("a");
  });
  succeeds(() => {
    return parser.parse("a+a");
  });
  succeeds(() => {
    return parser.parse("a*a");
  });
  succeeds(() => {
    return parser.parse("a+a");
  });
  succeeds(() => {
    return parser.parse("a+a*a");
  });
  succeeds(() => {
    return parser.parse("a*a+a");
  });
  fails(() => {
    return parser.parse("b");
  });
  fails(() => {
    return parser.parse("a+b");
  });
  fails(() => {
    return parser.parse("b*a");
  });
  fails(() => {
    return parser.parse("a++a");
  });
  fails(() => {
    return parser.parse("a+a**a");
  });
  return fails(() => {
    return parser.parse("a*a+");
  });
})();

//# sourceMappingURL=grammar-utils.test.js.map
