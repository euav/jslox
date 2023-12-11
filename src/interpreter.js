import { TokenType } from "./scanner";

class RuntimeError extends Error {}

class Interpreter {
  static interpret(ast) {
    try {
      result = Interpreter.eval(ast);
      return { result: result, hadError: false };
    } catch (error) {
      return { result: null, hadError: true };
    }
  }

  static eval(ast) {
    return ast.accept(Interpreter);
  }

  static isTruthy(value) {
    if (value === null || value === false) return false;
    return true;
  }

  static isEqual(a, b) {
    if (a === NaN && b === NaN) return true;
    return a === b;
  }

  static visitLiteralExpr(expr) {
    return expr.value;
  }

  static visitGroupingExpr(expr) {
    return Interpreter.eval(expr.expression);
  }

  static visitUnaryExpr(expr) {
    right = Interpreter.eval(expr.right);

    switch (expr.operator.type) {
      case TokenType.BANG:
        return !Interpreter.isTruthy(right);
      case TokenType.MINUS:
        return -Number(right);
    }

    return null;
  }

  static visitBinaryExpr(expr) {
    left = Interpreter.eval(expr.left);
    right = Interpreter.eval(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        return Number(left) - Number(right);
      case TokenType.STAR:
        return Number(left) * Number(right);
      case TokenType.SLASH:
        return Number(left) / Number(right);

      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        break;

      case TokenType.LESS:
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        return Number(left) <= Number(right);
      case TokenType.GREATER:
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        return Number(left) >= Number(right);
      case TokenType.EQUAL_EQUAL:
        return Interpreter.isEqual(left, right);
      case TokenType.BANG_EQUAL:
        return !Interpreter.isEqual(left, right);
    }

    return null;
  }
}
