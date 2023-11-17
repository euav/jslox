import { AstPrinter } from "../src/ast-printer.js";
import { Expr } from "../src/ast.js";
import { Token, TokenType } from "../src/scanner.js";

let expression = new Expr.Binary(
  new Expr.Unary(
    new Token(TokenType.MINUS, "-", null, 1),
    new Expr.Literal(123),
  ),
  new Token(TokenType.STAR, "*", null, 1),
  new Expr.Grouping(new Expr.Literal(45.67)),
);

console.log(AstPrinter.print(expression));
