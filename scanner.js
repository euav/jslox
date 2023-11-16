const TokenType = {
    // Single-character tokens
    LEFT_PAREN: "LEFT_PAREN", RIGHT_PAREN: "RIGHT_PAREN",
    LEFT_BRACE: "LEFT_BRACE", RIGHT_BRACE: "RIGHT_BRACE",
    DOT: "DOT", COMMA: "COMMA",
    PLUS: "PLUS", MINUS: "MINUS",
    STAR: "STAR", SLASH: "SLASH",
    SIMICOLON: "SEMICOLON",

    // One or two character tokens
    EQUAL: "EQUAL", EQUAL_EQUAL: "EQUAL_EQUAL",
    BANG: "BANG", BANG_EQUAL: "BANG_EQUAL",
    LESS: "LESS", LESS_EQUAL: "LESS_EQUAL",
    GREATER: "GREATER", GREATER_EQUAL: "GREATER_EQUAL",

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

    EOF: "EOF"
};

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

        this.start = 0;
        this.current = 0;
        this.line = 1;
    }

    isAtEnd() {
        return this.current >= this.source.length;
    }

    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken()
        }
        
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
        return this.tokens;
    }

    scanToken() {
        let c = advance();
        switch (c) {
            case '(': addToken(TokenType.LEFT_PAREN); break;
        }
    }
}

export {TokenType, Token, Scanner};
