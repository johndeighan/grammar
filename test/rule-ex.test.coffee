# rule-ex.test.coffee

import {
	undef, defined, notdefined,
	} from '@jdeighan/llutils'
import * as lib2 from '@jdeighan/llutils/utest'
Object.assign(global, lib2)
import * as lib from '@jdeighan/grammar/rule-ex'
Object.assign(global, lib)

# ---------------------------------------------------------------------------

(() =>
	hRule = {
		type: "rule"
		head: "E"
		lParts: [
			terminal "P"
			nonterminal "name"
			terminal "a"
			nonterminal "expr"
			]
		}
	equal ruleAsString(hRule), 'E -> "P" name "a" expr'
	equal ruleAsString(hRule, 3), 'E -> "P" name "a" • expr'
	)()
