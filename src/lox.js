import { readFileSync } from "fs";
import { createInterface } from "readline";
import { Scanner } from "./scanner.js";
import { Parser } from "./parser.js";
import { AstPrinter } from "./ast-printer.js";

class Lox {
  constructor() {
    this.hadError = false;
  }

  run(source) {
    let scanner = new Scanner(source);
    let { tokens, hadError: scannerError } = scanner.scanTokens();
    if (scannerError) {
      this.hadError = true;
      return;
    }

    let parser = new Parser(tokens);
    let { ast, hadError: parserError } = parser.parse();
    if (parserError) {
      this.hadError = true;
      return;
    }

    console.log(AstPrinter.print(ast));
  }

  runFile(path) {
    let bytes = readFileSync(path);
    this.run(bytes.toString());

    if (this.hadError) {
      process.exit(65);
    }
  }

  runRepl() {
    const io = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    io.write("> ");
    io.on("line", (line) => {
      this.run(line);
      io.write("> ");
    }).on("close", () => process.exit());
  }
}

export { Lox };
