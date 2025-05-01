import fs from "fs";
import path from "path";
import { patterns } from "./tokens_regexs.js";
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
    // Split into lines first
    const lines = inputText.split(/\r?\n/);
    // Track if we're inside a multi-line comment
    let inMultiLineComment = false;
    // Process each line to remove comments while preserving line numbers
    // Remove single-line comments and multi-line comments
    const processedLines = lines.map((line) => {
        // Handle multi-line comments
        if (line.includes("/*")) {
            inMultiLineComment = true;
            return "";
        }
        if (line.includes("*/")) {
            inMultiLineComment = false;
            return "";
        }
        if (inMultiLineComment) {
            return "";
        }
        // Remove single-line comments
        return line.replace(/\/\/.*$/g, "").trim();
    });
    const tokens = [];
    const errors = new Set();
    processedLines.forEach((line, lineNumber) => {
        // Preserve the original line number
        const actualLineNumber = lineNumber + 1;
        if (line.trim() === "")
            return;
        // Handle string literals first
        let currentLine = line;
        const stringMatches = currentLine.match(/"[^"]*"?/g) || [];
        const stringPositions = [];
        stringMatches.forEach((match) => {
            const isComplete = match.endsWith('"');
            stringPositions.push({
                value: match,
                ...(isComplete ? {} : { error: "Unclosed string literal" }),
            });
            currentLine = currentLine.replace(match, ""); // Remove string literals
        });
        // Split remaining tokens by whitespace
        const tokenOfLine = currentLine.trim().split(/\s+/).filter(Boolean);
        // Process each token
        tokenOfLine.forEach((token) => {
            if (token === "")
                return;
            let type = "unknown";
            let error;
            // Determine token type
            if (patterns.KEYWORD.regex.test(token)) {
                type = "keyword";
            }
            else if (patterns.OPERATOR.regex.test(token)) {
                type = "operator";
            }
            else if (patterns.SEPARATOR.regex.test(token)) {
                type = "separator";
            }
            else if (patterns.NUMBER.regex.test(token)) {
                type = "number";
            }
            else if (patterns.Identifier.regex.test(token)) {
                type = "identifier";
            }
            else {
                type = "unknown";
                error = `Invalid token: "${token}"`;
            }
            tokens.push({
                type,
                value: token,
                line: actualLineNumber,
                ...(error && { error }),
            });
            if (error) {
                errors.add(error);
            }
        });
        // Add string literals back with validation
        stringPositions.forEach(({ value, error }) => {
            tokens.push({
                type: "string_literal",
                value: value,
                line: actualLineNumber,
                ...(error && { error }),
            });
            if (error) {
                errors.add(error);
            }
        });
    });
    // Print unique errors
    if (errors.size > 0) {
        console.log("Errors detected:");
        tokens
            .filter((token) => token.error)
            .forEach((token) => console.log(`Line ${token.line}: ${token.error}`));
    }
    // Save output in JSON format
    const outputPath = path.join(process.cwd(), "data", "token", source.token_name);
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), "utf8");
    console.log("Tokenization complete. Check", source.token_name, "for results.");
}
catch (error) {
    console.error("Processing error:", error);
}
