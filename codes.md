/ \*
console.log("------------------------------");

const test = parse(inputText);

function isToken(node: any): boolean {
return node && node.image !== undefined && node.tokenType !== undefined;
}

// Parse and traverse the CST
try {
const cst = parse(inputText);

    // Create a function to traverse the CST
    function traverseCST(node: any) {
        // If it's a token, print it
        if (isToken(node)) {
            console.log("Found Token:", {
                type: node.tokenType.name,
                value: node.image,
                line: node.startLine,
                column: node.startColumn,
            });
            return;
        }

        // If it has children, traverse them
        if (node && node.children) {
            Object.values(node.children).forEach((child) => {
                if (Array.isArray(child)) {
                    child.forEach((item) => traverseCST(item));
                } else {
                    traverseCST(child);
                }
            });
        }
    }

    // Start traversing from the root
    // traverseCST(cst);

} catch (error) {
console.error("Parsing error:", error);
}

// ----------------------- ------------------

    // Print tokens in a readable formast
        console.log("Tokens found:");

        visitor.tokens.forEach((token, index) => {
            console.log(`\n[Token ${index + 1}]`);
            console.log(`Type: ${token.type}`);
            console.log(`Value: "${token.value}"`);
            console.log(
                `Location: Line ${token.startLine}, Column ${token.startColumn}`
            );
            tokens = `\n[Token ${index + 1}]`;
            tokens += `\nType: ${token.type}`;
            tokens += `\nValue: "${token.value}"`;
            tokens += `\nLocation: Line ${token.startLine}, Column ${token.startColumn} \n`;
            fs.writeFileSync("test_java_parser.txt", tokens, {
                encoding: "utf-8",
                flag: "a+",
            });
            tokens = "";
        });


    visit(ctx: any) {
        if (ctx && ctx.image) {
            this.tokens.push({
                type: ctx.tokenType?.name || "unknown",
                value: ctx.image,
                startLine: ctx.startLine,
                startColumn: ctx.startColumn,
            });
        }

        if (ctx && typeof ctx === "object") {
            Object.values(ctx).forEach((value) => {
                if (Array.isArray(value)) {
                    value.forEach((item) => this.visit(item));
                } else {
                    this.visit(value);
                }
            });
        }
    }

\

\*/

---

// Remove multi-line comments first
// const noMultilineComments = inputText.replace(/\/\*[\s\S]_?\*\//g, "");
// Remove single-line comments
// const noComments = noMultilineComments.replace(/\/\/._/g, "");

// export const patterns = {
// // Comments
// SINGLE_LINE_COMMENT: { regex: /\/\/._?(?:\r\n|\r|\n|$)/g, type: "COMMENT" }, // Single-line comment
// MULTI_LINE_COMMENT: { regex: /\/\*[\s\S]_?\*\//g, type: "COMMENT" }, // Multi-line comment
// // AT:{ regex: /@[\w.]+/g, type: "AT" }, // Annotations

// // String literals
// STRING_LITERAL: { regex: /"(?:[^"\\]|\\.)\*"/g, type: "STRING_LITERAL" },

// // Character literals
// CHAR_LITERAL: { regex: /'(?:[^'\\]|\\.)\*'/g, type: "CHAR_LITERAL" },

// // Keywords & Identifiers (simplified - in real implementation needs more context)
// KEYWORD: {
// regex: /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null|var)\b/g,
// type: "KEYWORD",
// },

// // Identifiers
// Identifier: { regex: /[a-zA-Z\_$][a-zA-Z0-9_$]\*/g, type: "Identifier" },

// // Number literals
// FLOAT_LITERAL: {
// regex: /\b\d+\.\d\*(?:[eE][+-]?\d+)?[fFdD]?\b|\b\.\d+(?:[eE][+-]?\d+)?[fFdD]?\b|\b\d+(?:[eE][+-]?\d+)?[fFdD]\b/g,
// type: "FLOAT_LITERAL",
// },
// INT_LITERAL: {
// regex: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+)[lL]?\b/g,
// type: "INT_LITERAL",
// },

// NUMBER:{
// regex: /\b\d+(\.\d+)?\b/g,
// type: "NUMBER",
// }

// // Operators
// OPERATOR: {
// regex: /==|!=|<=|>=|&&|\|\||<<|>>|>>>|\+\+|--|[-+*/%&|^!~<>=]=?|\?|:|\.|\.\.|\.\.\.|->/g,
// type: "OPERATOR",
// },

// // Separators
// SEPARATOR: { regex: /[;,.(){}[\]@]/g, type: "SEPARATOR" },

// // Whitespace (usually skipped, but keeping track for column counting)
// WHITESPACE: { regex: /\s+/g, type: "WHITESPACE" },
// };
