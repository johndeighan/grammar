// rule-ex.coffee
var raisedDot;

import {
  undef,
  defined,
  notdefined,
  OL,
  ML,
  hasKey,
  identityFunc,
  isString,
  isInteger,
  isArray,
  assert,
  croak,
  getOptions
} from '@jdeighan/llutils';

import {
  MultiMap
} from '@jdeighan/llutils/multi-map';

raisedDot = '•';

export var phi = 'Φ';

export var RuleEx = (function() {
  // ---------------------------------------------------------------------------
  //     class RuleEx
  // ---------------------------------------------------------------------------
  class RuleEx {
    static resetNextID() {
      RuleEx.nextID = 0;
    }

    static getNextID() {
      var id;
      id = RuleEx.nextID;
      RuleEx.nextID += 1;
      return id;
    }

    static getNew(hRule, src, pos = 0) {
      var obj;
      obj = RuleEx.mm.get([hRule, src, pos]);
      if (defined(obj)) {
        return obj;
      } else {
        obj = new RuleEx(hRule, src, pos);
        RuleEx.mm.set([hRule, src, pos], obj);
        return obj;
      }
    }

    constructor(hRule1, src1, pos1 = 0) {
      this.hRule = hRule1;
      this.src = src1;
      this.pos = pos1;
      this.id = RuleEx.getNextID();
      checkRule(this.hRule, this.id);
      // --- Copy fields from hRule to this object
      this.type = this.hRule.type;
      this.head = this.hRule.head;
      this.lParts = this.hRule.lParts;
      assert(isInteger(this.src), `Not an int: ${OL(this.src)}`);
      this.maxpos = this.lParts.length;
    }

    nextPart() { // --- may return undef
      return this.lParts[this.pos];
    }

    getInc() {
      assert(this.pos + 1 <= this.maxpos, `Can't inc ${ML(this)}`);
      return RuleEx.getNew(this.hRule, this.src, this.pos + 1);
    }

    asString() {
      return `[${this.id}] ${ruleAsString(this.hRule, {
        pos: this.pos
      })} / ${this.src}`;
    }

  };

  RuleEx.nextID = 0;

  RuleEx.mm = new MultiMap(3);

  return RuleEx;

}).call(this);

// ---------------------------------------------------------------------------
// An hRule looks like:
//    {
//       type: 'rule'
//       head: String
//       lParts: [
//          {
//             type: 'terminal' | 'nonterminal',
//             value: String
//             }
//       }
// ---------------------------------------------------------------------------
export var terminal = function(value) {
  assert([isString(value), value.length === 1], `Bad terminal: ${OL(value)}`);
  return {
    type: 'terminal',
    value
  };
};

// ---------------------------------------------------------------------------
export var nonterminal = function(name) {
  assert(isString(name), `bad nonterminal: ${OL(name)}`);
  return {
    type: 'nonterminal',
    value: name
  };
};

// ---------------------------------------------------------------------------
export var checkRule = function(hRule, id = 1) {
  assert([hRule.type === "rule", hasKey(hRule, 'head'), isString(hRule.head), hasKey(hRule, 'lParts'), isArray(hRule.lParts)], `Bad rule: ${OL(hRule)}`);
};

// ---------------------------------------------------------------------------
export var ruleFromString = function(str, hOptions = {}) {
  var classify, lParts;
  ({classify} = getOptions(hOptions, {
    classify: (s) => {
      if (s.match(/^[A-Z][A-Za-z]*$/)) {
        return 'nonterminal';
      } else {
        return 'terminal';
      }
    }
  }));
  lParts = str.split(/\s+/);
  assert([lParts.length > 2, lParts[1] === '->', classify(lParts[0]) === 'nonterminal'], `Bad rule: ${OL(str)}`);
  return {
    type: 'rule',
    head: lParts[0],
    lParts: lParts.slice(2).map((x) => {
      switch (classify(x)) {
        case 'nonterminal':
          return {
            type: 'nonterminal',
            value: x
          };
        case 'terminal':
          return {
            type: 'terminal',
            value: x
          };
        default:
          return croak(`Bad rule: ${OL(str)}`);
      }
    })
  };
};

// ---------------------------------------------------------------------------
export var ruleAsString = function(hRule, hOptions = {}) {
  var lRHS, pos, rhs, transformNonTerminal, transformTerminal;
  ({pos, transformTerminal, transformNonTerminal} = getOptions(hOptions, {
    pos: undef,
    transformTerminal: identityFunc,
    transformNonTerminal: identityFunc
  }));
  lRHS = hRule.lParts.map((hPart) => {
    switch (hPart.type) {
      case "terminal":
        return transformTerminal(hPart.value);
      case "nonterminal":
        return transformNonTerminal(hPart.value);
    }
  });
  if (defined(pos)) {
    lRHS.splice(pos, 0, raisedDot);
  }
  rhs = lRHS.join(" ");
  return `${hRule.head} -> ${rhs}`;
};

//# sourceMappingURL=rule-ex.js.map
