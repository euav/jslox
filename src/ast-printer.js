class AstPrinter {
  static print(expr) {
    return expr.accept(AstPrinter);
  }

  static _print(name, ...exprs) {
    let output = "(" + name;
    for (const expr of exprs) {
      output += " " + expr.accept(AstPrinter);
    }

    return output + ")";
  }

  static visitLiteralExpr(expr) {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  static visitUnaryExpr(expr) {
    return AstPrinter._print(expr.operator.lexeme, expr.right);
  }

  static visitBinaryExpr(expr) {
    return AstPrinter._print(expr.operator.lexeme, expr.left, expr.right);
  }

  static visitGroupingExpr(expr) {
    return AstPrinter._print("group", expr.expression);
  }
}

export { AstPrinter };
