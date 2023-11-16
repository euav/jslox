import { logger } from "./logger.js";

const TokenType = {
  // Single-character tokens
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  LEFT_BRACE: "LEFT_BRACE",
  RIGHT_BRACE: "RIGHT_BRACE",
  DOT: "DOT",
  COMMA: "COMMA",
  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",
  SEMICOLON: "SEMICOLON",

  // One or two character tokens
  EQUAL: "EQUAL",
  EQUAL_EQUAL: "EQUAL_EQUAL",
  BANG: "BANG",
  BANG_EQUAL: "BANG_EQUAL",
  LESS: "LESS",
  LESS_EQUAL: "LESS_EQUAL",
  GREATER: "GREATER",
  GREATER_EQUAL: "GREATER_EQUAL",

  // Literals
  IDENTIFIER: "IDENTIFIER",
  STRING: "STRING",
  NUMBER: "NUMBER",

  // Keywords
  AND: "AND",
  CLASS: "CLASS",
  ELSE: "ELSE",
  FALSE: "FALSE",
  FUN: "FUN",
  FOR: "FOR",
  IF: "IF",
  NIL: "NIL",
  OR: "OR",
  PRINT: "PRINT",
  RETURN: "RETURN",
  SUPER: "SUPER",
  THIS: "THIS",
  TRUE: "TRUE",
  VAR: "VAR",
  WHILE: "WHILE",

  EOF: "EOF",
};

const keywords = new Map([
  ["and", TokenType.AND],
  ["class", TokenType.CLASS],
  ["else", TokenType.ELSE],
  ["false", TokenType.FALSE],
  ["fun", TokenType.FUN],
  ["for", TokenType.FOR],
  ["if", TokenType.IF],
  ["nil", TokenType.NIL],
  ["or", TokenType.OR],
  ["print", TokenType.PRINT],
  ["return", TokenType.RETURN],
  ["super", TokenType.SUPER],
  ["this", TokenType.THIS],
  ["true", TokenType.TRUE],
  ["var", TokenType.VAR],
  ["while", TokenType.WHILE],
]);

class Token {
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    return this.type + " " + this.lexeme + " " + this.literal;
  }
}

class Scanner {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.hadError = false;

    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  static isAlpha(character) {
    return (
      ("a" <= character && character <= "z") ||
      ("A" <= character && character <= "Z") ||
      character == "_"
    );
  }

  static isDigit(character) {
    return "0" <= character && character <= "9";
  }

  static isAlphaNumeric(character) {
    return Scanner.isAlpha(character) || Scanner.isDigit(character);
  }

  addToken(type, literal) {
    let lexeme = this.source.slice(this.start, this.current);
    this.tokens.push(new Token(type, lexeme, literal ?? null, this.line));
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return { tokens: this.tokens, hadError: this.hadError };
  }

  advance() {
    return this.source[this.current++];
  }

  peek() {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current];
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1];
  }

  match(expected) {
    if (this.peek() !== expected) return false;

    this.current++;
    return true;
  }

  scanString() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      logger.error(this.line, "Unterminated string");
      this.hadError = true;
      return;
    }

    this.advance();

    let stringLiteral = this.source.slice(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, stringLiteral);
  }

  scanNumber() {
    while (Scanner.isDigit(this.peek())) this.advance();
    if (this.peek() == "." && Scanner.isDigit(this.peekNext())) {
      this.advance();
      while (Scanner.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      TokenType.NUMBER,
      Number.parseFloat(this.source.slice(this.start, this.current)),
    );
  }

  scanIdentifer() {
    while (Scanner.isAlphaNumeric(this.peek())) this.advance();

    let text = this.source.slice(this.start, this.current);
    let tokenType = keywords.get(text) ?? TokenType.IDENTIFIER;
    this.addToken(tokenType);
  }

  scanToken() {
    let c = this.advance();

    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;

      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );
        break;

      case "/":
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case " ":
      case "\r":
      case "\t":
        break;

      case "\n":
        this.line++;
        break;

      case '"':
        this.scanString();
        break;

      default:
        if (Scanner.isDigit(c)) {
          this.scanNumber();
        } else if (Scanner.isAlpha(c)) {
          this.scanIdentifer();
        } else {
          logger.error(this.line, "Unexpected character");
          this.hadError = true;
        }
    }
  }
}

export { TokenType, Token, Scanner };
