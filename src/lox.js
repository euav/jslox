import { readFileSync } from "fs";
import { createInterface } from "readline";
import { Scanner } from "./scanner.js";

class Lox {
  constructor() {
    this.hadError = false;
  }

  run(source) {
    let scanner = new Scanner(source);
    let { tokens, hadError } = scanner.scanTokens();
    this.hadError = hadError;

    for (let token of tokens) {
      console.log(token);
    }
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
