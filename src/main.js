import { Lox } from "./lox.js";

const argc = process.argv.length;

let lox = new Lox();

if (argc != 2 && argc != 3) {
  console.log("Usage: node lox [script]");
  process.exit(64);
} else if (argc == 3) {
  lox.runFile(process.argv[2]);
} else {
  lox.runRepl();
}
