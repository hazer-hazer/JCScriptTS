enum TokenType {
	T_NULL,
	T_BOOL,
	T_NUM,
	T_STR,
	T_ID,
	T_KW,
	T_OP,
	T_PROG_END
}

const operators: string[] = [
	'+', '-', '*', '/', '%',
	'=',
	'(', ')'
]

const is_op = (str: string): boolean => operators.includes(str)


const keywords: string[] = [
	'if', 'else',
	'var', 'val',
	'func'
]

const is_kw = (str: string): boolean => keywords.includes(str)

class Token {
	type: TokenType
	val: string

	line: number
	column: number

	constructor(type: TokenType, val: string, line: number, column: number){
		this.type = type
		this.val = val

		// Maybe put it to start of Lexer token recognition
		this.line = line
		this.column = column
	}
}

export { TokenType, Token, is_op, is_kw }