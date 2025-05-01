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
