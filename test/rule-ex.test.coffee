# rule-ex.test.coffee

import {
	undef, defined, notdefined,
	} from '@jdeighan/llutils'
import * as lib2 from '@jdeighan/llutils/utest'
Object.assign(global, lib2)
import * as lib from '@jdeighan/grammar/rule-ex'
Object.assign(global, lib)

# ---------------------------------------------------------------------------

equal ruleFromString('E -> T'), {
	type: 'rule'
	head: 'E'
	lParts: [
		{type: 'nonterminal', value: 'T'}
		]
	}

equal ruleFromString('E -> T'), {
	type: 'rule'
	head: 'E'
	lParts: [
		nonterminal('T')
		]
	}

equal ruleFromString('E -> a'), {
	type: 'rule'
	head: 'E'
	lParts: [
		{type: 'terminal', value: 'a'}
		]
	}

equal ruleFromString('E -> a'), {
	type: 'rule'
	head: 'E'
	lParts: [
		terminal('a')
		]
	}

equal ruleFromString('Expr -> Expr + Term'), {
	type: 'rule'
	head: 'Expr'
	lParts: [
		nonterminal 'Expr'
		terminal '+'
		nonterminal 'Term'
		]
	}


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
	transformTerminal = (x) => return "\"#{x}\""
	equal ruleAsString(hRule, {transformTerminal}), 'E -> "P" name "a" expr'
	equal ruleAsString(hRule, {transformTerminal, pos: 3}), 'E -> "P" name "a" • expr'
	)()
