import { Expr } from "./ast.js";
import { TokenType } from "./scanner.js";
import { logger } from "./logger.js";

/* Grammar for Lox
 *
 * expression -> equality
 * equality   -> comparison ( ( "!=" | "==" ) comparison )*
 * comparison -> term ( ( ">" | ">=" | "<" | "<=" ) term )*
 * term       -> factor ( ( "-" | "+" ) factor )*
 * factor     -> unary ( ( "/" | "*" ) unary )*
 * unary      -> ( "!" | "-" ) unary | primary
 * primary    -> NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")"
 */

class ParserError extends Error {}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  isAtEnd() {
    return this.peek().type == TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  error(token, message) {
    if (token.type == TokenType.EOF) {
      logger.error(token.line, " at end", message);
    } else {
      logger.error(token.line, ` at ${token.lexeme}`, message);
    }

    return new ParserError();
  }

  synchronize() {
    this.advance();

    while (this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }

  parse() {
    try {
      return { ast: this.expression(), hadError: false };
    } catch (error) {
      return { ast: null, hadError: true };
    }
  }

  expression() {
    return this.equality();
  }

  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  comparison() {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  term() {
    let expr = this.factor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  factor() {
    let expr = this.unary();

    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Expr.Unary(operator, right);
    }

    return this.primary();
  }

  primary() {
    if (this.match(TokenType.FALSE)) return new Expr.Literal(false);
    if (this.match(TokenType.TRUE)) return new Expr.Literal(true);
    if (this.match(TokenType.NIL)) return new Expr.Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Expr.Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression");
      return new Expr.Grouping(expr);
    }

    throw this.error(this.peek(), "Expect expression");
  }
}

export { Parser };
