import { parse, BaseJavaCstVisitorWithDefaults, } from "java-parser";
import fs from "fs";
import path from "path";
// Create a custom visitor to extract tokens
class JavaTokenVisitor extends BaseJavaCstVisitorWithDefaults {
    tokens = [];
    constructor() {
        super();
    }
    visit(ctx) {
        const stack = [ctx];
        while (stack.length > 0) {
            const current = stack.pop();
            if (current && current.image) {
                const isComment = current.tokenType?.name === "MultiLineComment" ||
                    current.tokenType?.name === "LineComment" ||
                    current.tokenType?.name === "TraditionalComment";
                if (!isComment) {
                    this.tokens.push({
                        type: current.tokenType?.name || "unknown",
                        value: current.image,
                        startLine: current.startLine,
                        startColumn: current.startColumn,
                    });
                }
            }
            if (current && typeof current === "object") {
                const values = Object.values(current);
                for (const value of values) {
                    if (Array.isArray(value)) {
                        // Add array elements to stack in reverse order
                        // so they get processed in the correct order
                        for (let i = value.length - 1; i >= 0; i--) {
                            stack.push(value[i]);
                        }
                    }
                    else {
                        stack.push(value);
                    }
                }
            }
        }
    }
}
const sourceCodes = {
    source_1: {
        name: "DSA.java",
        token_name: "DSA.json",
        code: path.join(process.cwd(), "java", "DSA.java"),
    },
    source_2: {
        name: "File.java",
        token_name: "File.json",
        code: path.join(process.cwd(), "java", "File.java"),
    },
};
try {
    const source = sourceCodes.source_2;
    const inputText = fs.readFileSync(source.code, "utf8");
    // Add basic error recovery
    let cst;
    try {
        cst = parse(inputText);
    }
    catch (parseError) {
        // If parsing fails, do a simple tokenization of the input
        console.warn("Parser error encountered, falling back to basic tokenization");
        // Simple regex-based tokenization
        const tokens = inputText.match(/\/\*[\s\S]*?\*\/|\/\/.*|"[^"]*"|[a-zA-Z_]\w*|\d+(?:\.\d+)?|[+\-*/=<>!&|^~?:;.,{}()\[\]]|\S+/g) || [];
        // Create a basic CST structure
        cst = {
            name: "compilationUnit",
            children: {
                tokens: tokens.map((t, i) => ({
                    image: t,
                    startLine: 1, // Basic line tracking
                    startColumn: i + 1,
                    tokenType: { name: "Token" },
                })),
            },
        };
    }
    // Continue with your existing visitor
    const visitor = new JavaTokenVisitor();
    visitor.visit(cst);
    fs.writeFileSync(path.join(process.cwd(), "data", "token", source.token_name), JSON.stringify(visitor.tokens.sort((a, b) => a.startLine - b.startLine), null, 2), {
        encoding: "utf-8",
        flag: "a+",
    });
}
catch (error) {
    console.error("Processing error:", error);
}
/*
try {
    // Parse the code
    const source = sourceCodes.source_2;
    const inputText = fs.readFileSync(source.code, "utf8");
    const cst = parse(inputText);

    // Create and use our visitor
    const visitor = new JavaTokenVisitor();
    visitor.visit(cst);

    fs.writeFileSync(
        path.join(process.cwd(), "data", "token", source.token_name),
        JSON.stringify(
            visitor.tokens.sort((a, b) => a.startLine - b.startLine),
            null,
            2
        ),
        {
            encoding: "utf-8",
            flag: "a+",
        }
    );
} catch (error) {
    console.error("Parsing error:", error);
}
*/
