# parseStr.coffee

import {
	undef, defined, notdefined, LOG, OL,
	} from '@jdeighan/llutils'
import {slurp} from '@jdeighan/llutils/fs'
import * as lib from '@jdeighan/grammar'
Object.assign(global, lib)
import {hExprAST} from '@jdeighan/grammar/grammars'

stringToParse = process.argv[2] || 'a*a'

# ---------------------------------------------------------------------------

LOG "PARSING: #{OL(stringToParse)}"

parser = new EarleyParser(hExprAST)
LOG parser.asString()

try
	result = parser.parse(stringToParse)
	LOG "\nRESULT: #{OL(result)}"
catch err
	if (err instanceof SyntaxError)
		LOG "Syntax Error: #{err.message}"
	else
		LOG "ERROR: #{err.message}"
