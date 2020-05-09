import { TokenType, Token, is_op, is_kw } from './Token'

class Lexer {
	code: string
	tokens: Token[]

	index: number
	current: string

	line: number
	column: number

	constructor(){
		this.index = 0
		this.line = 1
		this.column = 1
		this.tokens = []
	}

	peek(){
		return this.current = this.code[this.index]
	}

	advance(){
		this.index++
		if(this.peek() === '\n'){
			this.line++
			this.column = 1
		}else{
			this.column++
		}
		return this.peek()
	}

	add_token(t: TokenType, v: string){
		this.tokens.push(new Token(t, v, this.line, this.column))
	}

	is_skipable(ch: string){
		return ch === ' '  || ch === '\t' || ch === '\n' ||
			   ch === '\v' || ch === '\f' || ch === '\r' 
	}
	is_digit(ch: string){
		const c: number = ch.charCodeAt(0)
		return c >= 48 && c <= 57
	}
	is_identifier_first(ch: string){
		const c: number = ch.charCodeAt(0)
		return c >= 65  && c >= 90  || // Large alpha
			   c >= 97  && c <= 122 || // Small alpha
		       ch === '$' || ch === '_'
	}
	is_identifier(ch: string){
		return this.is_identifier_first(ch) || this.is_digit(ch)
	}
	is_punct(ch: string){
		const c: number = ch.charCodeAt(0)
		return c == 33 || c == 35 || c == 37  || c == 38 ||
			   c >= 40 && c <= 47 || c >= 58  && c <= 64 ||
			   c >= 91 && c <= 95 || c >= 123 && c <= 126
	}
	is_quote(ch: string){
		return ch === '"' || ch === '\''
	}

	// Errors
	error(msg: string){
		throw `\e[0;31m ${msg} at ${this.line}:${this.column}`;
	}

	unexpected_token(){
		this.error(`Unexpected token '${this.current}'`);
	}

	lex(code: string){
		this.code = code
		
		let type: TokenType = TokenType.T_NULL
		let val: string

		while(this.peek()){
		
			val = ""

			if(this.is_skipable(this.current)){
				this.advance()
				continue;
			}else if(this.is_identifier_first(this.current)){
				do{
					val += this.current
				}while(this.is_identifier(this.advance()))

				if(is_kw(val)){
					type = TokenType.T_KW
				}else{
					type = TokenType.T_ID
				}
			}else if(this.is_digit(this.current)){
				do{
					val += this.current
				}while(this.is_digit(this.advance()))
				
				if(this.current === '.'){
					val += this.current
					if(!this.is_digit(this.advance())){
						this.unexpected_token()
					}
					while(this.is_digit(this.current)){
						val += this.current
						this.advance()
					}
				}
				type = TokenType.T_NUM
			}else if(this.is_quote(this.current)){
				const quote: string = this.current
				while(this.advance() != quote && this.current && this.current != '\n'){
					val += this.current
				}
				if(!this.current || this.current != quote){
					this.error(`Expected ending quote ${quote}`)
				}
				this.advance()
				type = TokenType.T_STR
			}else if(this.is_punct(this.current)){
				do{
					val += this.current
				}while(is_op(val + this.advance()))

				type = TokenType.T_OP
			}else{
				this.unexpected_token()
			}

			this.add_token(type, val)
		}

		this.add_token(TokenType.T_PROG_END, '')

		return this.tokens
	}
}

export default Lexer