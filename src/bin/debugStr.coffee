# debugStr.coffee

import * as readline from 'node:readline/promises'
import {stdin, stdout} from 'node:process'
rl = readline.createInterface {
	input: stdin
	output: stdout
	terminal: true
	}

import {
	undef, defined, notdefined, LOG, OL,
	} from '@jdeighan/llutils'
import {slurp} from '@jdeighan/llutils/fs'
import * as lib from '@jdeighan/grammar'
Object.assign(global, lib)
import {hExprAST} from '@jdeighan/grammar/grammars'

stringToParse = process.argv[2] || 'a*a'
LOG "PARSING: #{OL(stringToParse)}"

# ---------------------------------------------------------------------------

parser = new EarleyParser(hExprAST)
LOG parser.asString()

iterator = parser.parse_generator(stringToParse, 'debug')
try
	loop
		ans = await rl.question('> ')
		switch ans
			when 'q'
				LOG 'quitting...'
				process.exit()
			else
				next = iterator.next()
				if next.done
					LOG "\nRESULT: #{OL(next.value)}"
					process.exit()
catch err
	if (err instanceof SyntaxError)
		LOG "Syntax Error: #{err.message}"
	else
		LOG "ERROR: #{err.message}"
	process.exit()
