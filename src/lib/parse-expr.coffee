# parse-expr.coffee

import {
	undef, defined, notdefined, LOG, OL,
	assert, croak,
	} from '@jdeighan/llutils'
import {
	EarleyParser,
	} from '@jdeighan/grammar'

# ---------------------------------------------------------------------------

grammarStr = """
	E -> E + T
	E -> T
	T -> T * P
	T -> P
	P -> a
	"""

# ---------------------------------------------------------------------------

export parseExpr = (str) =>

	parser = new EarleyParser(grammarStr)
	return parser.parse(str)
