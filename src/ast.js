// This file is auto-generated from scripts/GenerateAst.js

var Expr = {
  Literal: class Literal {
    constructor(value) {
      this.value = value;
    }

    accept(visitor) {
      return visitor.visitLiteralExpr(this);
    }
  },
  Unary: class Unary {
    constructor(operator, right) {
      this.operator = operator;
      this.right = right;
    }

    accept(visitor) {
      return visitor.visitUnaryExpr(this);
    }
  },
  Binary: class Binary {
    constructor(left, operator, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
    }

    accept(visitor) {
      return visitor.visitBinaryExpr(this);
    }
  },
  Grouping: class Grouping {
    constructor(expression) {
      this.expression = expression;
    }

    accept(visitor) {
      return visitor.visitGroupingExpr(this);
    }
  },
};

export { Expr };
