import { writeFileSync } from "fs";

let classes = [
  { name: "Literal", fields: ["value"] },
  { name: "Unary", fields: ["operator", "right"] },
  { name: "Binary", fields: ["left", "operator", "right"] },
  { name: "Grouping", fields: ["expression"] },
];

let output = `// This file is auto-generated from scripts/GenerateAst.js
\nvar Expr = {\n`;

for (let { name, fields } of classes) {
  output += `  ${name}: class ${name} {\n`;
  output += `    constructor(${fields.join(", ")}) {\n`;
  for (let field of fields) {
    output += `      this.${field} = ${field};\n`;
  }
  output += `    }\n\n`;
  output += `    accept(visitor) {\n`;
  output += `      return visitor.visit${name}Expr(this);\n`;
  output += `    }\n`;
  output += `  },\n`;
}
output += `};\n\n`;
output += `export { Expr };\n`;

writeFileSync("src/ast.js", output);
