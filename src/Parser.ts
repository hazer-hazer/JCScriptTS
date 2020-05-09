import { ASTNode, ASTBinNode } from './ASTNode'
import { Token, TokenType } from './Token'

// Type for precedence table
type PrecTable = { [key: string]: number }

const PREC_BIN: PrecTable = {
	'=': 3,
	'||': 5,
	'&&': 6,
	'==': 10, '!=': 10,
	'<': 11, '>': 11, '<=': 11, '>=': 11,
	'+': 13, '-': 13,
	'*': 14, '/': 14
}

const PREC_PRE: PrecTable = {}

const PREC_POST: PrecTable = {}

type Tree = ASTNode[]

class Parser {
	tree: Tree
	tokens: Token[]

	index: number
	current: ASTNode
	advanced: boolean

	constructor(){
		this.index = 0
		this.current = null
		this.advanced = false
	}

	peek() : ASTNode {
		if(!this.advanced){
			return this.current
		}
		this.advanced = false

		this.current = new ASTNode()
		this.current.interpret(this.tokens[this.index])
		return this.current
	}

	advance() : ASTNode {
		this.index++
		this.advanced = true
		return this.peek()
	}

	end() : boolean {
		return this.peek().type === TokenType.T_PROG_END
	}

	// Determinators
	is_op(op: string) : boolean {
		return this.peek().type === TokenType.T_OP
			&& this.peek().val === op
	}

	is_bin_op(op: ASTNode) : boolean {
		return this.peek().type === TokenType.T_OP
			&& typeof op.val === 'string'
			&& Object.keys(PREC_BIN).includes(op.val)
	}
	// TODO: is_pre_op, is_post_op

	is_kw(kw: string) : boolean {
		return this.peek().type === TokenType.T_KW
			&& this.peek().val === kw
	}

	skip_op(op: string) : void {
		if(this.is_op(op)){
			this.advance()
		}else{
			this.expected_error(op, this.peek().val)
		}
	}

	expected_error(expected: string, given: string){
		throw `Expected ${expected}, ${given} given`
	}

	parse(tokens: Token[]) : Tree {
		this.tokens = tokens

		while(!this.end()){
			this.tree.push(this.parse_expression())
		}

		return this.tree
	}

	parse_expression() : ASTNode {
		return this.maybe_call(() => this.maybe_binary(this.parse_atom(), 0))
	}

	maybe_call(expression: () => ASTNode) : ASTNode {
		let left: ASTNode = expression()
		return this.is_op('(') ? this.parse_call(left) : left
	}

	maybe_binary(left: ASTNode, prec: number) : ASTNode {
		let node: ASTNode = this.peek()
		if(this.is_bin_op(node)){
			let cur_prec = PREC_BIN[this.peek().val]
			if(cur_prec > prec){
				this.advance()
				return this.maybe_binary(new ASTBinNode(node.val, left, this.maybe_binary(this.parse_atom(), cur_prec)), prec)
			}
		}

		return left
	}

	parse_delimited(b: string, e: string, sep: string, parser: () => ASTNode) : ASTNode {
		let nodes: ASTNode[]
		let first: boolean = true
		this.skip_op(b)
		while(!this.end()){
			if(this.is_op(e)){
				break
			}
			if(first){
				first = false
			}
		}
	}

	parse_atom() : ASTNode {
		return this.maybe_call(() => {
			if(this.is_op('(')){
				this.advance()
				let node: ASTNode = this.parse_expression()
				this.skip_op(')')
				return node
			}

			if(this.is_op('{')){
				return this.parse_scope()
			}
			// TODO: conditions, bool???, functions and etc.
		})
	}

	parse_scope(){

	}

}

export default Parser