# grammar-utils.test.coffee

import {
	undef, defined, notdefined,
	} from '@jdeighan/llutils'
import {
	terminal, nonterminal, RuleEx,
	} from '@jdeighan/grammar/rule-ex'
import * as lib2 from '@jdeighan/llutils/utest'
Object.assign(global, lib2)
import * as lib from '@jdeighan/grammar'
Object.assign(global, lib)
import {hSimpleAST} from '@jdeighan/grammar/grammars'

# ---------------------------------------------------------------------------
#symbol RuleEx

# --- T -> T * P
rule = {
	type: "rule"
	head: "T"
	lParts: [
		nonterminal "T"
		terminal    "*"
		nonterminal "P"
		]
	}

rx = new RuleEx(rule, 0)
equal rx.pos, 0

rx2 = rx3 = rx4 = rx5 = undef

succeeds () => rx2 = rx.getInc()
equal rx2.pos, 1

succeeds () => rx3 = rx2.getInc()
succeeds () => rx4 = rx3.getInc()
equal rx4.pos, 3
fails () => rx5 = rx4.getInc()

# ---------------------------------------------------------------------------
#symbol Grammar

grammar = undef
succeeds () =>
	grammar = new Grammar(hSimpleAST)
truthy grammar instanceof Grammar
equal grammar.getRule(2), rule
equal grammar.root(), "E"
equal grammar.asString(), """
	E -> E + T
	E -> T
	T -> T * P
	T -> P
	P -> a
	"""
nRules = 0
for rule from grammar.alternatives("T")
	nRules = nRules + 1
	equal rule.head, "T"
equal nRules, 2

# ---------------------------------------------------------------------------
#symbol EarleyParser

parser = new EarleyParser(hSimpleAST)

succeeds () => parser.parse("a")
succeeds () => parser.parse("a+a")
succeeds () => parser.parse("a*a")
succeeds () => parser.parse("a+a")
succeeds () => parser.parse("a+a*a")
succeeds () => parser.parse("a*a+a")

fails () => parser.parse("b")
fails () => parser.parse("a+b")
fails () => parser.parse("b*a")
fails () => parser.parse("a++a")
fails () => parser.parse("a+a**a")
fails () => parser.parse("a*a+")

# ---------------------------------------------------------------------------
# create Grammar object from a string

(() =>
	grammar = new Grammar(astFromString("""
		E -> E + T
		E -> T
		T -> T * P
		T -> P
		P -> a
		"""))
	equal grammar.asString(), """
		E -> E + T
		E -> T
		T -> T * P
		T -> P
		P -> a
		"""
	)()

# ---------------------------------------------------------------------------
# create an EarleyParser object from a string

(() =>
	parser = new EarleyParser("""
		E -> E + T
		E -> T
		T -> T * P
		T -> P
		P -> a
		""")

	succeeds () => parser.parse("a")
	succeeds () => parser.parse("a+a")
	succeeds () => parser.parse("a*a")
	succeeds () => parser.parse("a+a")
	succeeds () => parser.parse("a+a*a")
	succeeds () => parser.parse("a*a+a")

	fails () => parser.parse("b")
	fails () => parser.parse("a+b")
	fails () => parser.parse("b*a")
	fails () => parser.parse("a++a")
	fails () => parser.parse("a+a**a")
	fails () => parser.parse("a*a+")
	)()

# ---------------------------------------------------------------------------
# use a more complex grammar

(() =>
	parser = new EarleyParser("""
		E -> E + T
		E -> T
		T -> T * P
		T -> P
		P -> a
		P -> ( E )
		""")

	succeeds () => parser.parse("a")
	succeeds () => parser.parse("a+a")
	succeeds () => parser.parse("a*a")
	succeeds () => parser.parse("a+a")
	succeeds () => parser.parse("a+a*a")
	succeeds () => parser.parse("a*a+a")
	succeeds () => parser.parse("(a+a)*a")
	succeeds () => parser.parse("a*(a+a)")
	succeeds () => parser.parse("(a*a+a)")
	succeeds () => parser.parse("((a*a+a))")
	succeeds () => parser.parse("(a*(a+a))")
	succeeds () => parser.parse("((a*a)+a)")

	fails () => parser.parse("b")
	fails () => parser.parse("a+b")
	fails () => parser.parse("b*a")
	fails () => parser.parse("a++a")
	fails () => parser.parse("a+a**a")
	fails () => parser.parse("a*a+")
	fails () => parser.parse("a+a**a")
	fails () => parser.parse("a*a+")
	fails () => parser.parse("(a+a*a")
	fails () => parser.parse("a*a+a)")
	)()
