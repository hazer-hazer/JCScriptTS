import Lexer from './src/Lexer'

const code = `
	func greeting(){
		print('Hello')
	}
`;

const lexer = new Lexer()

const tokens = lexer.lex(code)

console.log(tokens)
