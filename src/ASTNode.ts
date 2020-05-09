import { Token, TokenType } from './Token'

class ASTNode {

	type: TokenType = TokenType.T_NULL
	val: any

	line: number
	column: number

	interpret(token: Token){
		this.line = token.line
		this.column = token.column

		switch(token.type){
			case TokenType.T_BOOL:{
				this.val = token.val === 'true'
				break;
			}
			case TokenType.T_NUM:{
				this.val = parseFloat(token.val)
				break;
			}
			default:{
				this.val = token.val
			}
		}
	}

}

class ASTBinNode extends ASTNode {
	left: ASTNode
	right: ASTNode

	op: string

	constructor(op: string, left: ASTNode, right: ASTNode){
		super()

		this.op = op
		this.left = left
		this.right = right
	}
}

export { ASTNode, ASTBinNode }