import fs from "fs";
import path from "path";
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
    // const source = sourceCodes.source_1;
    const source = sourceCodes.source_2;
    const inputText = fs.readFileSync(source.code, "utf8");
    // Remove multi-line comments first
    const noMultilineComments = inputText.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove single-line comments
    const noComments = noMultilineComments.replace(/\/\/.*/g, "");
    // Split into lines and process
    const lines = noComments.split(/\r?\n/);
    const tokens = [];
    lines.forEach((line, lineNumber) => {
        if (line.trim() === "")
            return; // ⛔ Skip empty lines
        const tokenOfLine = line.trim().split(/\s+/); // split by all whitespace
        // const tokenOfLine = line.split(" ");
        tokenOfLine.forEach((token) => {
            // const match = token.match(tokenRegex);
            tokens.push({
                value: token,
                line: lineNumber + 1,
            });
        });
    });
    // Save output in JSON format
    const outputPath = path.join(process.cwd(), "data", "token", source.token_name);
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2), "utf8");
}
catch (error) {
    console.error("Processing error:", error);
}
