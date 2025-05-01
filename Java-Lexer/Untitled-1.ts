import fs from "fs";
import path from "path";
import {
    javaKeywords,
    javaOperators,
    javaSeparators,
} from "./tokens_regexs.js";

const sourceCodes: {
    [key: string]: { name: string; token_name: string; code: string };
} = {
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

type TokenType =
    | "keyword"
    | "identifier"
    | "operator"
    | "separator"
    | "literal"
    | "number"
    | "unknown";

// Define token patterns dynamically
const patterns = {
    keyword: new RegExp(`^(${javaKeywords.join("|")})$`),
    operator: new RegExp(
        `^(${javaOperators
            .map((op) => op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|")})$`
    ),
    separator: new RegExp(
        `^(${javaSeparators
            .map((sep) => sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|")})$`
    ),
    number: /^-?\d+(\.\d+)?$/,
    identifier: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    stringLiteral: /^"[^"]*"?$/,
};

try {
    const source = sourceCodes.source_2;
    const inputText = fs.readFileSync(source.code, "utf8");

    // Remove multi-line comments first
    const noMultilineComments = inputText.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove single-line comments
    const noComments = noMultilineComments.replace(/\/\/.*/g, "");

    // Split into lines and process
    const lines = noComments.split(/\r?\n/);

    const tokens: Array<{
        type: TokenType;
        value: string;
        line: number;
        error?: string;
    }> = [];

    const errors = new Set<string>();

    lines.forEach((line, lineNumber) => {
        if (line.trim() === "") return;

        // Handle string literals first
        let currentLine = line;
        const stringMatches = line.match(/"[^"]*"?/g) || [];
        const stringPositions: { start: number; end: number; value: string }[] =
            [];

        stringMatches.forEach((match) => {
            const startIdx = currentLine.indexOf(match);
            if (startIdx !== -1) {
                stringPositions.push({
                    start: startIdx,
                    end: startIdx + match.length,
                    value: match,
                });
                // Replace string with spaces to preserve position
                currentLine =
                    currentLine.slice(0, startIdx) +
                    " ".repeat(match.length) +
                    currentLine.slice(startIdx + match.length);
            }
        });

        // Split remaining tokens
        const tokenOfLine = currentLine.trim().split(/\s+/);

        // Process each token
        tokenOfLine.forEach((token) => {
            if (token === "") return;

            let type: TokenType = "unknown";
            let error: string | undefined;

            // Determine token type
            if (patterns.keyword.test(token)) {
                type = "keyword";
            } else if (patterns.operator.test(token)) {
                type = "operator";
            } else if (patterns.separator.test(token)) {
                type = "separator";
            } else if (patterns.number.test(token)) {
                type = "number";
            } else if (patterns.identifier.test(token)) {
                type = "identifier";
            } else {
                type = "unknown";
                error = `Invalid token: "${token}"`;
            }

            // Add token to the list
            tokens.push({
                type,
                value: token,
                line: lineNumber + 1,
                ...(error && { error }),
            });

            // Track unique errors
            if (error) {
                errors.add(error);
            }
        });

        // Add string literals back with validation
        stringPositions.forEach(({ value }) => {
            const isComplete = value.endsWith('"');
            const error = !isComplete ? "Unclosed string literal" : undefined;

            tokens.push({
                type: "literal",
                value: value,
                line: lineNumber + 1,
                ...(error && { error }),
            });

            // Track unique errors
            if (error) {
                errors.add(error);
            }
        });
    });

    // Print unique errors
    if (errors.size > 0) {
        console.log("Errors detected:");
        errors.forEach((err) => console.log(`- ${err}`));
    }

    // Save output in JSON format
    const outputPath = path.join(
        process.cwd(),
        "data",
        "token",
        source.token_name
    );

    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), "utf8");

    console.log(
        "Tokenization complete. Check",
        source.token_name,
        "for results."
    );
} catch (error) {
    console.error("Processing error:", error);
}
