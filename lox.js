import { readFileSync } from "fs";
import { createInterface } from "readline";
import { Scanner } from "./scanner.js";


function run(source, io) {
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();

    for (let token of tokens) {
        console.log(token);
    }
}

function runFile(path) {
    let bytes = readFileSync(path);
    run(bytes.toString())

}

function runRepl() {
    const io = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });

    io.write("> ");
    io.on("line", (line) => {
        run(line, io);
        io.write("> ");
    }).on("close", () => process.exit());
}

function main() {
    const argc = process.argv.length
    if (argc != 2 && argc != 3) {
        console.log("Usage: node lox [script]");
        process.exit(64);
    } else if (argc == 3) {
        runFile(process.argv[2]);
    } else {
        runRepl();
    }
}

main()
