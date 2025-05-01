import { parse } from "java-parser";
import fs from "fs";
import path from "path";

// Define token interface according to requirements
interface Token {
    type: string; // Token category (keyword, identifier, operator, etc.)
    value: string; // Actual text from source
    line: number; // Line number in source
    column: number; // Starting column in source
}

// Define a basic token structure that matches what java-parser returns
interface LexerToken {
    image: string;
    startLine?: number;
    startColumn?: number;
    tokenType: {
        name: string;
    };
}

/**
 * Process a single Java file and generate token output
 */
function processFile(filePath: string): void {
    try {
        // Ensure output directory exists
        const outputDir = path.join(process.cwd(), "data", "token");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Read the input file
        const inputText = fs.readFileSync(filePath, "utf8");

        // Parse the Java code using the corrected approach
        let lexerTokens: LexerToken[] = [];

        try {
            // Try parsing with any available options that might expose lexer tokens
            const parseResult = parse(inputText);

            // If tokens are available through a different property or method,
            // we would access them here. Since the API has changed, we need to
            // adapt our approach.

            // For now, we'll use a fallback method to tokenize the Java code
            lexerTokens = tokenizeJavaFallback(inputText);
        } catch (parseError) {
            console.error(
                "Error during parsing, using fallback tokenizer:",
                parseError
            );
            lexerTokens = tokenizeJavaFallback(inputText);
        }

        // Convert tokens to required format
        const tokens: Token[] = lexerTokens.map((token) => ({
            type: categorizeToken(token.tokenType.name, token.image),
            value: token.image,
            line: token.startLine || 0,
            column: token.startColumn || 0,
        }));

        // Create output file path
        const fileName = path.basename(filePath, path.extname(filePath));
        const outputPath = path.join(outputDir, `${fileName}_tokens.json`);

        // Write tokens to JSON file
        fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

        console.log(`Processed ${filePath} - Tokens written to ${outputPath}`);
        console.log(`Found ${tokens.length} tokens`);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        throw error;
    }
}

/**
 * Fallback tokenizer for Java code when direct access to lexer tokens is not available
 */
function tokenizeJavaFallback(sourceCode: string): LexerToken[] {
    const tokens: LexerToken[] = [];

    // Java token patterns
    const patterns = [
        // Comments
        { regex: /\/\/.*?(?:\r\n|\r|\n|$)/g, type: "COMMENT" }, // Single-line comment
        { regex: /\/\*[\s\S]*?\*\//g, type: "COMMENT" }, // Multi-line comment
        { regex: /@[\w.]+/g, type: "AT" }, // Annotations

        // String literals
        { regex: /"(?:[^"\\]|\\.)*"/g, type: "STRING_LITERAL" },

        // Character literals
        { regex: /'(?:[^'\\]|\\.)*'/g, type: "CHAR_LITERAL" },

        // Keywords & Identifiers (simplified - in real implementation needs more context)
        {
            regex: /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null|var)\b/g,
            type: "KEYWORD",
        },

        // Identifiers
        { regex: /[a-zA-Z_$][a-zA-Z0-9_$]*/g, type: "Identifier" },

        // Number literals
        {
            regex: /\b\d+\.\d*(?:[eE][+-]?\d+)?[fFdD]?\b|\b\.\d+(?:[eE][+-]?\d+)?[fFdD]?\b|\b\d+(?:[eE][+-]?\d+)?[fFdD]\b/g,
            type: "FLOAT_LITERAL",
        },
        {
            regex: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+)[lL]?\b/g,
            type: "INT_LITERAL",
        },

        // Operators
        {
            regex: /==|!=|<=|>=|&&|\|\||<<|>>|>>>|\+\+|--|[-+*/%&|^!~<>=]=?|\?|:|\.|\.\.|\.\.\.|->/g,
            type: "OPERATOR",
        },

        // Separators
        { regex: /[;,.(){}[\]@]/g, type: "SEPARATOR" },

        // Whitespace (usually skipped, but keeping track for column counting)
        { regex: /\s+/g, type: "WHITESPACE" },
    ];

    // Process each line to track line and column numbers
    let lineNumber = 1;
    let lines = sourceCode.split(/\r\n|\r|\n/);

    lines.forEach((line, lineIndex) => {
        let currentLine = lineIndex + 1;
        let position = 0;

        while (position < line.length) {
            let matched = false;

            for (const pattern of patterns) {
                pattern.regex.lastIndex = 0; // Reset regex state
                const match = pattern.regex.exec(line.slice(position));

                if (match && match.index === 0) {
                    const value = match[0];

                    // Skip whitespace tokens (but still update position)
                    if (pattern.type !== "WHITESPACE") {
                        tokens.push({
                            image: value,
                            startLine: currentLine,
                            startColumn: position + 1, // 1-based column indexing
                            tokenType: { name: pattern.type },
                        });
                    }

                    position += value.length;
                    matched = true;
                    break;
                }
            }

            // If no pattern matched, skip one character
            if (!matched) {
                tokens.push({
                    image: line[position],
                    startLine: currentLine,
                    startColumn: position + 1,
                    tokenType: { name: "ERROR" },
                });
                position++;
            }
        }
    });

    return tokens;
}

/**
 * Categorize tokens into the required types
 */
function categorizeToken(tokenType: string, tokenValue: string): string {
    // Java keywords list
    const javaKeywords = [
        "abstract",
        "assert",
        "boolean",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "class",
        "const",
        "continue",
        "default",
        "do",
        "double",
        "else",
        "enum",
        "extends",
        "final",
        "finally",
        "float",
        "for",
        "goto",
        "if",
        "implements",
        "import",
        "instanceof",
        "int",
        "interface",
        "long",
        "native",
        "new",
        "package",
        "private",
        "protected",
        "public",
        "return",
        "short",
        "static",
        "strictfp",
        "super",
        "switch",
        "synchronized",
        "this",
        "throw",
        "throws",
        "transient",
        "try",
        "void",
        "volatile",
        "while",
        "true",
        "false",
        "null",
        "var",
    ];

    // Check if token is a keyword
    if (javaKeywords.includes(tokenValue.toLowerCase())) {
        return "keyword";
    }

    // Keywords identified by token type
    if (tokenType === "KEYWORD") {
        return "keyword";
    }

    // Identifiers
    if (tokenType === "Identifier") {
        return "identifier";
    }

    // Operators
    if (
        tokenType === "OPERATOR" ||
        [
            "+",
            "-",
            "*",
            "/",
            "%",
            "=",
            "==",
            "!=",
            ">",
            "<",
            ">=",
            "<=",
            "&&",
            "||",
            "!",
            "&",
            "|",
            "^",
            "<<",
            ">>",
            ">>>",
            "+=",
            "-=",
            "*=",
            "/=",
            "%=",
            "&=",
            "|=",
            "^=",
            "<<=",
            ">>=",
            ">>>=",
            "++",
            "--",
            "?",
            ":",
            "->",
            "::",
        ].includes(tokenValue)
    ) {
        return "operator";
    }

    // Separators
    if (
        tokenType === "SEPARATOR" ||
        ["(", ")", "{", "}", "[", "]", ";", ",", "."].includes(tokenValue)
    ) {
        return "separator";
    }

    // Literals
    if (tokenType.includes("LITERAL") || tokenType.includes("_LITERAL")) {
        if (tokenType.includes("STRING")) return "string";
        if (tokenType.includes("CHAR")) return "char";
        if (tokenType.includes("FLOAT") || tokenType.includes("DOUBLE"))
            return "float";
        if (tokenType.includes("INT") || tokenType.includes("LONG"))
            return "integer";
        if (tokenType.includes("BOOL")) return "boolean";
        if (tokenType.includes("NULL")) return "null";
        return "literal";
    }

    // Comments
    if (tokenType.includes("COMMENT")) {
        return "comment";
    }

    // Annotations
    if (tokenType === "AT" || tokenValue === "@") {
        return "annotation";
    }

    return "unknown";
}

/**
 * Process multiple Java files
 */
function processFiles(filePaths: string[]): void {
    let successCount = 0;
    let errorCount = 0;

    for (const filePath of filePaths) {
        if (!filePath.endsWith(".java")) {
            console.warn(`Skipping non-Java file: ${filePath}`);
            continue;
        }

        try {
            processFile(filePath);
            successCount++;
        } catch (error) {
            console.error(`Failed to process ${filePath}`);
            errorCount++;
        }
    }

    console.log(
        `\nSummary: Processed ${successCount} files successfully, ${errorCount} files with errors.`
    );

    if (errorCount > 0) {
        process.exit(1);
    }
}

/**
 * Main function with hardcoded file paths
 */
function main(): void {
    // HARDCODED FILE PATHS - Add your Java file paths here
    const filePaths = [
        // path.join(process.cwd(), "java", "Calculator.java"),
        path.join(process.cwd(), "java", "DSA.java"),
        // path.join(process.cwd(), "java", "examples", "Calculator.java"),
        // Add more file paths as needed
    ];

    console.log("Processing the following files:");
    filePaths.forEach((file) => console.log(`- ${file}`));

    processFiles(filePaths);
}

// Execute the main function
main();

// Export functions for testing
export { processFile, processFiles, categorizeToken };


/* 

// import { createToken, Lexer, ILexingResult } from "chevrotain";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Get the current file path and directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define token interface according to requirements
// interface Token {
//     type: string; // Token category (keyword, identifier, operator, etc.)
//     value: string; // Actual text from source
//     line: number; // Line number in source
//     column: number; // Starting column in source
// }

// // Define all Java token types using Chevrotain
// const createJavaTokens = () => {
//     // Whitespace and comments
//     const WhiteSpace = createToken({
//         name: "WhiteSpace",
//         pattern: /\s+/,
//         group: Lexer.SKIPPED,
//     });

//     const LineComment = createToken({
//         name: "LineComment",
//         pattern: /\/\/[^\n\r]*/,
//         group: "comments",
//     });

//     const BlockComment = createToken({
//         name: "BlockComment",
//         pattern: /\/\*[\s\S]*?\*\//,
//         group: "comments",
//     });

//     // Keywords
//     const keywords = [
//         "abstract",
//         "assert",
//         "boolean",
//         "break",
//         "byte",
//         "case",
//         "catch",
//         "char",
//         "class",
//         "const",
//         "continue",
//         "default",
//         "do",
//         "double",
//         "else",
//         "enum",
//         "extends",
//         "final",
//         "finally",
//         "float",
//         "for",
//         "goto",
//         "if",
//         "implements",
//         "import",
//         "instanceof",
//         "int",
//         "interface",
//         "long",
//         "native",
//         "new",
//         "package",
//         "private",
//         "protected",
//         "public",
//         "return",
//         "short",
//         "static",
//         "strictfp",
//         "super",
//         "switch",
//         "synchronized",
//         "this",
//         "throw",
//         "throws",
//         "transient",
//         "try",
//         "void",
//         "volatile",
//         "while",
//         "var",
//     ];

//     const keywordTokens = keywords.map((keyword) =>
//         createToken({
//             name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
//             pattern: new RegExp(`\\b${keyword}\\b`),
//             group: "keywords",
//         })
//     );

//     // Boolean literals
//     const True = createToken({
//         name: "True",
//         pattern: /\btrue\b/,
//         group: "literals",
//     });

//     const False = createToken({
//         name: "False",
//         pattern: /\bfalse\b/,
//         group: "literals",
//     });

//     const Null = createToken({
//         name: "Null",
//         pattern: /\bnull\b/,
//         group: "literals",
//     });

//     // Literals
//     const StringLiteral = createToken({
//         name: "StringLiteral",
//         pattern: /"(?:[^"\\]|\\.)*"/,
//         group: "literals",
//     });

//     const CharLiteral = createToken({
//         name: "CharLiteral",
//         pattern: /'(?:[^'\\]|\\.)*'/,
//         group: "literals",
//     });

//     const HexLiteral = createToken({
//         name: "HexLiteral",
//         pattern: /0[xX][0-9a-fA-F]+[lL]?/,
//         group: "literals",
//     });

//     const BinaryLiteral = createToken({
//         name: "BinaryLiteral",
//         pattern: /0[bB][01]+[lL]?/,
//         group: "literals",
//     });

//     const FloatLiteral = createToken({
//         name: "FloatLiteral",
//         pattern:
//             /\b\d+\.\d*(?:[eE][+-]?\d+)?[fFdD]?|\b\.\d+(?:[eE][+-]?\d+)?[fFdD]?|\b\d+(?:[eE][+-]?\d+)[fFdD]?|\b\d+[fFdD]\b/,
//         group: "literals",
//     });

//     const IntegerLiteral = createToken({
//         name: "IntegerLiteral",
//         pattern: /\b\d+[lL]?\b/,
//         group: "literals",
//     });

//     // Identifiers (must appear after all keywords)
//     const Identifier = createToken({
//         name: "Identifier",
//         pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
//     });

//     // Operators (sorted by length to avoid matching issues)
//     const operators = [
//         ">>>",
//         ">>>=",
//         ">>",
//         ">>=",
//         ">=",
//         ">",
//         "<<=",
//         "<<",
//         "<=",
//         "<",
//         "===",
//         "==",
//         "=",
//         "!==",
//         "!=",
//         "!",
//         "~",
//         "++",
//         "+=",
//         "+",
//         "--",
//         "-=",
//         "->",
//         "-",
//         "*=",
//         "*",
//         "/=",
//         "/",
//         "%=",
//         "%",
//         "&&",
//         "&=",
//         "&",
//         "||",
//         "|=",
//         "|",
//         "^=",
//         "^",
//         "?",
//         ":",
//         "::",
//         "...",
//         "..",
//         ".",
//     ];

//     const operatorTokens = operators.map((op) =>
//         createToken({
//             name: op.replace(/[^a-zA-Z0-9]/g, "_"),
//             pattern: new RegExp(op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
//             group: "operators",
//         })
//     );

//     // Separators
//     const separators = [";", ",", "(", ")", "{", "}", "[", "]", "@"];

//     const separatorTokens = separators.map((sep) =>
//         createToken({
//             name: sep.replace(/[^a-zA-Z0-9]/g, "_"),
//             pattern: new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
//             group: "separators",
//         })
//     );

//     // Create the token list, ensuring order is correct for matching
//     // Order matters! Longer operators before shorter ones, keywords before identifiers
//     const allTokens = [
//         WhiteSpace,
//         LineComment,
//         BlockComment,
//         ...keywordTokens,
//         True,
//         False,
//         Null,
//         StringLiteral,
//         CharLiteral,
//         HexLiteral,
//         BinaryLiteral,
//         FloatLiteral,
//         IntegerLiteral,
//         ...operatorTokens.sort(
//             (a, b) =>
//                 (b.PATTERN?.toString().length ?? 0) -
//                 (a.PATTERN?.toString().length ?? 0)
//         ),
//         ...separatorTokens,
//         Identifier,
//     ];

//     return {
//         tokens: allTokens,
//         tokenMap: {
//             keywords: keywordTokens,
//             operators: operatorTokens,
//             separators: separatorTokens,
//             literals: [
//                 StringLiteral,
//                 CharLiteral,
//                 HexLiteral,
//                 BinaryLiteral,
//                 FloatLiteral,
//                 IntegerLiteral,
//                 True,
//                 False,
//                 Null,
//             ],
//             comments: [LineComment, BlockComment],
//         },
//     };
// };

// // Create the lexer
// const { tokens } = createJavaTokens();
// const javaLexer = new Lexer(tokens, {
//     // Enable error recovery to capture lexical errors
//     positionTracking: "full",
//     errorMessageProvider: {
//         buildUnexpectedCharactersMessage: (
//             fullText,
//             startOffset,
//             length,
//             line,
//             column
//         ) => {
//             return `Unexpected character: "${fullText.substr(
//                 startOffset,
//                 length
//             )}" at line: ${line}, column: ${column}`;
//         },
//     },
// });

// /**
//  * Process a single Java file and generate token output
//  */
// function processFile(filePath: string): void {
//     try {
//         // Ensure output directory exists
//         const outputDir = path.join(process.cwd(), "data", "token");
//         if (!fs.existsSync(outputDir)) {
//             fs.mkdirSync(outputDir, { recursive: true });
//         }

//         // Read the input file
//         const inputText = fs.readFileSync(filePath, "utf8");

//         // Use Chevrotain to tokenize the input
//         const lexingResult: ILexingResult = javaLexer.tokenize(inputText);

//         // Process tokens
//         const tokens: Token[] = [];

//         // First, process all valid tokens
//         lexingResult.tokens.forEach((token) => {
//             tokens.push({
//                 type: categorizeToken(token.tokenType.name, token.image),
//                 value: token.image,
//                 line: token.startLine || 0,
//                 column: token.startColumn || 0,
//             });
//         });

//         // Then, process lexical errors
//         if (lexingResult.errors.length > 0) {
//             lexingResult.errors.forEach((error) => {
//                 // Add error tokens
//                 tokens.push({
//                     type: "error",
//                     value: error.message,
//                     line: error.line || 0,
//                     column: error.column || 0,
//                 });
//             });
//         }

//         // Sort tokens by line and column
//         tokens.sort((a, b) => {
//             if (a.line !== b.line) {
//                 return a.line - b.line;
//             }
//             return a.column - b.column;
//         });

//         // Create output file path
//         const fileName = path.basename(filePath, path.extname(filePath));
//         const outputPath = path.join(outputDir, `${fileName}_tokens.json`);

//         // Write tokens to JSON file
//         fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

//         console.log(`Processed ${filePath} - Tokens written to ${outputPath}`);
//         console.log(`Found ${tokens.length} tokens`);

//         // Report any errors
//         const errors = tokens.filter((t) => t.type === "error");
//         if (errors.length > 0) {
//             console.log(`Found ${errors.length} lexical errors`);
//             errors.forEach((e) => {
//                 console.log(
//                     `  Line ${e.line}, Column ${e.column}: '${e.value}'`
//                 );
//             });
//         }
//     } catch (error) {
//         console.error(`Error processing file ${filePath}:`, error);
//         throw error;
//     }
// }

// /**
//  * Categorize tokens into the required types
//  */
// function categorizeToken(tokenType: string, tokenValue: string): string {
//     // Java keywords
//     const keywords = [
//         "Abstract",
//         "Assert",
//         "Boolean",
//         "Break",
//         "Byte",
//         "Case",
//         "Catch",
//         "Char",
//         "Class",
//         "Const",
//         "Continue",
//         "Default",
//         "Do",
//         "Double",
//         "Else",
//         "Enum",
//         "Extends",
//         "Final",
//         "Finally",
//         "Float",
//         "For",
//         "Goto",
//         "If",
//         "Implements",
//         "Import",
//         "Instanceof",
//         "Int",
//         "Interface",
//         "Long",
//         "Native",
//         "New",
//         "Package",
//         "Private",
//         "Protected",
//         "Public",
//         "Return",
//         "Short",
//         "Static",
//         "Strictfp",
//         "Super",
//         "Switch",
//         "Synchronized",
//         "This",
//         "Throw",
//         "Throws",
//         "Transient",
//         "Try",
//         "Void",
//         "Volatile",
//         "While",
//         "Var",
//     ];

//     if (keywords.includes(tokenType)) {
//         return "keyword";
//     }

//     // Boolean literals and null
//     if (["True", "False", "Null"].includes(tokenType)) {
//         return tokenType.toLowerCase() === "null" ? "null" : "boolean";
//     }

//     // Literals
//     if (tokenType === "StringLiteral") return "string";
//     if (tokenType === "CharLiteral") return "char";
//     if (tokenType === "FloatLiteral") return "float";
//     if (
//         tokenType === "IntegerLiteral" ||
//         tokenType === "HexLiteral" ||
//         tokenType === "BinaryLiteral"
//     )
//         return "integer";

//     // Identifier
//     if (tokenType === "Identifier") return "identifier";

//     // Comments
//     if (tokenType === "LineComment" || tokenType === "BlockComment")
//         return "comment";

//     // Determine if it's an operator or separator based on the token type
//     // For operators and separators, tokenType contains the actual character but with special chars replaced
//     const operator_chars = [
//         "=",
//         "+",
//         "-",
//         "*",
//         "/",
//         "%",
//         "&",
//         "|",
//         "^",
//         "!",
//         "~",
//         ">",
//         "<",
//         "?",
//         ":",
//         ".",
//         "->",
//         "::",
//     ];
//     const separator_chars = [";", ",", "(", ")", "{", "}", "[", "]", "@"];

//     // Check if the original tokenValue is an operator or separator
//     if (operator_chars.some((op) => tokenValue.includes(op))) return "operator";
//     if (separator_chars.some((sep) => tokenValue.includes(sep)))
//         return "separator";

//     // Annotation
//     if (tokenValue.startsWith("@")) return "annotation";

//     // If we couldn't categorize it, mark as unknown
//     return "unknown";
// }

// /**
//  * Process multiple Java files
//  */
// function processFiles(filePaths: string[]): void {
//     let successCount = 0;
//     let errorCount = 0;

//     for (const filePath of filePaths) {
//         if (!filePath.endsWith(".java")) {
//             console.warn(`Skipping non-Java file: ${filePath}`);
//             continue;
//         }

//         try {
//             processFile(filePath);
//             successCount++;
//         } catch (error) {
//             console.error(`Failed to process ${filePath}`);
//             errorCount++;
//         }
//     }

//     console.log(
//         `\nSummary: Processed ${successCount} files successfully, ${errorCount} files with errors.`
//     );

//     if (errorCount > 0) {
//         process.exit(1);
//     }
// }

// /**
//  * Main function with hardcoded file paths
//  */
// function main(): void {
//     // HARDCODED FILE PATHS - Add your Java file paths here
//     const filePaths = [
//         // path.join(process.cwd(), "Calculator.java"),
//         // path.join(process.cwd(), "TestLexer.java"),
//         path.join(process.cwd(), "java", "DSA.java"),
//     ];

//     console.log("Processing the following files:");
//     filePaths.forEach((file) => console.log(`- ${file}`));

//     processFiles(filePaths);
// }

// // Execute the main function only if this is the main module
// main();

// // Export functions for testing
// export { processFile, processFiles, categorizeToken };

// import { createToken, Lexer, ILexingResult } from "chevrotain";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Get the current file path and directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define token interface according to requirements
// interface Token {
//     type: string; // Token category (keyword, identifier, operator, etc.)
//     value: string; // Actual text from source
//     line: number; // Line number in source
//     column: number; // Starting column in source
// }

// // Define all Java token types using Chevrotain
// const createJavaTokens = () => {
//     // Whitespace and comments
//     const WhiteSpace = createToken({
//         name: "WhiteSpace",
//         pattern: /\s+/,
//         group: Lexer.SKIPPED,
//     });

//     const LineComment = createToken({
//         name: "LineComment",
//         pattern: /\/\/[^\n\r]*/,
//         group: "comments",
//     });

//     const BlockComment = createToken({
//         name: "BlockComment",
//         pattern: /\/\*[\s\S]*?\*\//,
//         group: "comments",
//     });

//     // Keywords
//     const keywords = [
//         "abstract",
//         "assert",
//         "boolean",
//         "break",
//         "byte",
//         "case",
//         "catch",
//         "char",
//         "class",
//         "const",
//         "continue",
//         "default",
//         "do",
//         "double",
//         "else",
//         "enum",
//         "extends",
//         "final",
//         "finally",
//         "float",
//         "for",
//         "goto",
//         "if",
//         "implements",
//         "import",
//         "instanceof",
//         "int",
//         "interface",
//         "long",
//         "native",
//         "new",
//         "package",
//         "private",
//         "protected",
//         "public",
//         "return",
//         "short",
//         "static",
//         "strictfp",
//         "super",
//         "switch",
//         "synchronized",
//         "this",
//         "throw",
//         "throws",
//         "transient",
//         "try",
//         "void",
//         "volatile",
//         "while",
//         "var",
//     ];

//     const keywordTokens = keywords.map((keyword) =>
//         createToken({
//             name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
//             pattern: new RegExp(`\\b${keyword}\\b`),
//             group: "keywords",
//         })
//     );

//     // Boolean literals
//     const True = createToken({
//         name: "True",
//         pattern: /\btrue\b/,
//         group: "literals",
//     });

//     const False = createToken({
//         name: "False",
//         pattern: /\bfalse\b/,
//         group: "literals",
//     });

//     const Null = createToken({
//         name: "Null",
//         pattern: /\bnull\b/,
//         group: "literals",
//     });

//     // Literals
//     const StringLiteral = createToken({
//         name: "StringLiteral",
//         pattern: /"(?:[^"\\]|\\.)*"/,
//         group: "literals",
//     });

//     const CharLiteral = createToken({
//         name: "CharLiteral",
//         pattern: /'(?:[^'\\]|\\.)*'/,
//         group: "literals",
//     });

//     const HexLiteral = createToken({
//         name: "HexLiteral",
//         pattern: /0[xX][0-9a-fA-F]+[lL]?/,
//         group: "literals",
//     });

//     const BinaryLiteral = createToken({
//         name: "BinaryLiteral",
//         pattern: /0[bB][01]+[lL]?/,
//         group: "literals",
//     });

//     const FloatLiteral = createToken({
//         name: "FloatLiteral",
//         pattern:
//             /\b\d+\.\d*(?:[eE][+-]?\d+)?[fFdD]?|\b\.\d+(?:[eE][+-]?\d+)?[fFdD]?|\b\d+(?:[eE][+-]?\d+)[fFdD]?|\b\d+[fFdD]\b/,
//         group: "literals",
//     });

//     const IntegerLiteral = createToken({
//         name: "IntegerLiteral",
//         pattern: /\b\d+[lL]?\b/,
//         group: "literals",
//     });

//     // Identifiers (must appear after all keywords)
//     const Identifier = createToken({
//         name: "Identifier",
//         pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
//     });

//     // Operators (sorted by length to avoid matching issues)
//     const operators = [
//         ">>>",
//         ">>>=",
//         ">>",
//         ">>=",
//         ">=",
//         ">",
//         "<<=",
//         "<<",
//         "<=",
//         "<",
//         "===",
//         "==",
//         "=",
//         "!==",
//         "!=",
//         "!",
//         "~",
//         "++",
//         "+=",
//         "+",
//         "--",
//         "-=",
//         "->",
//         "-",
//         "*=",
//         "*",
//         "/=",
//         "/",
//         "%=",
//         "%",
//         "&&",
//         "&=",
//         "&",
//         "||",
//         "|=",
//         "|",
//         "^=",
//         "^",
//         "?",
//         ":",
//         "::",
//         "...",
//         "..",
//         ".",
//     ];

//     const operatorTokens = operators.map((op) =>
//         createToken({
//             name: op.replace(/[^a-zA-Z0-9]/g, "_"),
//             pattern: new RegExp(op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
//             group: "operators",
//         })
//     );

//     // Separators
//     const separators = [";", ",", "(", ")", "{", "}", "[", "]", "@"];

//     const separatorTokens = separators.map((sep) =>
//         createToken({
//             name: sep.replace(/[^a-zA-Z0-9]/g, "_"),
//             pattern: new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
//             group: "separators",
//         })
//     );

//     // Create the token list, ensuring order is correct for matching
//     // Order matters! Longer operators before shorter ones, keywords before identifiers
//     const allTokens = [
//         WhiteSpace,
//         LineComment,
//         BlockComment,
//         ...keywordTokens,
//         True,
//         False,
//         Null,
//         StringLiteral,
//         CharLiteral,
//         HexLiteral,
//         BinaryLiteral,
//         FloatLiteral,
//         IntegerLiteral,
//         ...operatorTokens.sort(
//             (a, b) =>
//                 (b.PATTERN?.toString().length ?? 0) -
//                 (a.PATTERN?.toString().length ?? 0)
//         ),
//         ...separatorTokens,
//         Identifier,
//     ];

//     return {
//         tokens: allTokens,
//         tokenMap: {
//             keywords: keywordTokens,
//             operators: operatorTokens,
//             separators: separatorTokens,
//             literals: [
//                 StringLiteral,
//                 CharLiteral,
//                 HexLiteral,
//                 BinaryLiteral,
//                 FloatLiteral,
//                 IntegerLiteral,
//                 True,
//                 False,
//                 Null,
//             ],
//             comments: [LineComment, BlockComment],
//         },
//     };
// };

// // Create the lexer
// const { tokens } = createJavaTokens();
// const javaLexer = new Lexer(tokens, {
//     // Enable error recovery to capture lexical errors
//     positionTracking: "full",
//     errorMessageProvider: {
//         buildUnexpectedCharactersMessage: (
//             fullText,
//             startOffset,
//             length,
//             line,
//             column
//         ) => {
//             return `Unexpected character: "${fullText.substr(
//                 startOffset,
//                 length
//             )}" at line: ${line}, column: ${column}`;
//         },
//     },
// });

// /**
//  * Process a single Java file and generate token output
//  */
// function processFile(filePath: string): void {
//     try {
//         // Ensure output directory exists
//         const outputDir = path.join(process.cwd(), "data", "token");
//         if (!fs.existsSync(outputDir)) {
//             fs.mkdirSync(outputDir, { recursive: true });
//         }

//         // Read the input file
//         const inputText = fs.readFileSync(filePath, "utf8");

//         // Use Chevrotain to tokenize the input
//         const lexingResult: ILexingResult = javaLexer.tokenize(inputText);

//         // Process tokens
//         const tokens: Token[] = [];

//         // First, process all valid tokens
//         lexingResult.tokens.forEach((token) => {
//             // Use the correct token type based on the token's group and name
//             const type = categorizeToken(token.tokenType.name, token.image);

//             tokens.push({
//                 type: type,
//                 value: token.image,
//                 line: token.startLine || 0,
//                 column: token.startColumn || 0,
//             });
//         });

//         // Then, process lexical errors
//         if (lexingResult.errors.length > 0) {
//             lexingResult.errors.forEach((error) => {
//                 // Add error tokens
//                 tokens.push({
//                     type: "error",
//                     value: error.message,
//                     line: error.line || 0,
//                     column: error.column || 0,
//                 });
//             });
//         }

//         // Sort tokens by line and column
//         tokens.sort((a, b) => {
//             if (a.line !== b.line) {
//                 return a.line - b.line;
//             }
//             return a.column - b.column;
//         });

//         // Create output file path
//         const fileName = path.basename(filePath, path.extname(filePath));
//         const outputPath = path.join(outputDir, `${fileName}_tokens.json`);

//         // Write tokens to JSON file
//         fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

//         console.log(`Processed ${filePath} - Tokens written to ${outputPath}`);
//         console.log(`Found ${tokens.length} tokens`);

//         // Print token type counts for debugging
//         const typeCounts: Record<string, number> = {};
//         tokens.forEach((token) => {
//             typeCounts[token.type] = (typeCounts[token.type] || 0) + 1;
//         });

//         console.log("Token type counts:");
//         Object.entries(typeCounts).forEach(([type, count]) => {
//             console.log(`  ${type}: ${count}`);
//         });

//         // Report any errors
//         const errors = tokens.filter((t) => t.type === "error");
//         if (errors.length > 0) {
//             console.log(`Found ${errors.length} lexical errors`);
//             errors.forEach((e) => {
//                 console.log(
//                     `  Line ${e.line}, Column ${e.column}: '${e.value}'`
//                 );
//             });
//         }
//     } catch (error) {
//         console.error(`Error processing file ${filePath}:`, error);
//         throw error;
//     }
// }

// /**
//  * Categorize tokens into the required types
//  */
// function categorizeToken(tokenType: string, tokenValue: string): string {
//     // For debugging
//     // console.log(`Categorizing: ${tokenType} - ${tokenValue}`);

//     // Java keywords
//     const keywords = [
//         "Abstract",
//         "Assert",
//         "Boolean",
//         "Break",
//         "Byte",
//         "Case",
//         "Catch",
//         "Char",
//         "Class",
//         "Const",
//         "Continue",
//         "Default",
//         "Do",
//         "Double",
//         "Else",
//         "Enum",
//         "Extends",
//         "Final",
//         "Finally",
//         "Float",
//         "For",
//         "Goto",
//         "If",
//         "Implements",
//         "Import",
//         "Instanceof",
//         "Int",
//         "Interface",
//         "Long",
//         "Native",
//         "New",
//         "Package",
//         "Private",
//         "Protected",
//         "Public",
//         "Return",
//         "Short",
//         "Static",
//         "Strictfp",
//         "Super",
//         "Switch",
//         "Synchronized",
//         "This",
//         "Throw",
//         "Throws",
//         "Transient",
//         "Try",
//         "Void",
//         "Volatile",
//         "While",
//         "Var",
//     ];

//     if (keywords.includes(tokenType)) {
//         return "keyword";
//     }

//     // Boolean literals and null
//     if (["True", "False"].includes(tokenType)) {
//         return "boolean";
//     }

//     if (tokenType === "Null") {
//         return "null";
//     }

//     // Literals
//     if (tokenType === "StringLiteral") return "string";
//     if (tokenType === "CharLiteral") return "char";
//     if (tokenType === "FloatLiteral") return "float";
//     if (
//         tokenType === "IntegerLiteral" ||
//         tokenType === "HexLiteral" ||
//         tokenType === "BinaryLiteral"
//     )
//         return "integer";

//     // Identifier
//     if (tokenType === "Identifier") return "identifier";

//     // Comments
//     if (tokenType === "LineComment" || tokenType === "BlockComment")
//         return "comment";

//     // Operators
//     const operatorPatterns = [
//         "=",
//         "+",
//         "-",
//         "*",
//         "/",
//         "%",
//         "&",
//         "|",
//         "^",
//         "!",
//         "~",
//         ">",
//         "<",
//         "?",
//         ":",
//         ".",
//         "->",
//         "::",
//         "++",
//         "--",
//         "==",
//         "!=",
//         ">=",
//         "<=",
//         "&&",
//         "||",
//         "+=",
//         "-=",
//         "*=",
//         "/=",
//         "%=",
//         "&=",
//         "|=",
//         "^=",
//         "<<",
//         ">>",
//         ">>>",
//     ];

//     for (const op of operatorPatterns) {
//         const escapedOp = op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//         // Check if tokenType matches the expected pattern for this operator
//         const operatorRegex = new RegExp(
//             `^${escapedOp.replace(/[^a-zA-Z0-9]/g, "_")}$`
//         );
//         if (operatorRegex.test(tokenType)) {
//             return "operator";
//         }

//         // Direct value check as a fallback
//         if (tokenValue === op) {
//             return "operator";
//         }
//     }

//     // Separators
//     const separatorPatterns = [";", ",", "(", ")", "{", "}", "[", "]", "@"];
//     for (const sep of separatorPatterns) {
//         const escapedSep = sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//         // Check if tokenType matches the expected pattern for this separator
//         const separatorRegex = new RegExp(
//             `^${escapedSep.replace(/[^a-zA-Z0-9]/g, "_")}$`
//         );
//         if (separatorRegex.test(tokenType)) {
//             return "separator";
//         }

//         // Direct value check as a fallback
//         if (tokenValue === sep) {
//             return "separator";
//         }
//     }

//     // Annotation (@ prefix)
//     if (tokenValue.startsWith("@")) return "annotation";

//     // Safe fallback: check the actual value as a last resort
//     if (/^[+\-*/%&|^!~<>=?:.]+$/.test(tokenValue)) return "operator";
//     if (/^[;,(){}[\]@]$/.test(tokenValue)) return "separator";

//     // If we couldn't categorize it, mark as unknown
//     console.warn(`Could not categorize token: ${tokenType} - ${tokenValue}`);
//     return "unknown";
// }

// /**
//  * Process multiple Java files
//  */
// function processFiles(filePaths: string[]): void {
//     let successCount = 0;
//     let errorCount = 0;

//     for (const filePath of filePaths) {
//         if (!filePath.endsWith(".java")) {
//             console.warn(`Skipping non-Java file: ${filePath}`);
//             continue;
//         }

//         try {
//             processFile(filePath);
//             successCount++;
//         } catch (error) {
//             console.error(`Failed to process ${filePath}`);
//             errorCount++;
//         }
//     }

//     console.log(
//         `\nSummary: Processed ${successCount} files successfully, ${errorCount} files with errors.`
//     );

//     if (errorCount > 0) {
//         process.exit(1);
//     }
// }

// /**
//  * Main function with hardcoded file paths
//  */
// function main(): void {
//     // HARDCODED FILE PATHS - Add your Java file paths here
//     const filePaths = [
//         // path.join(process.cwd(), "Calculator.java"),
//         // path.join(process.cwd(), "TestLexer.java"),
//         path.join(process.cwd(), "java", "DSA.java"),
//     ];

//     console.log("Processing the following files:");
//     filePaths.forEach((file) => console.log(`- ${file}`));

//     processFiles(filePaths);
// }

// // Execute the main function only if this is the main module
// main();

// // Export functions for testing
// export { processFile, processFiles, categorizeToken };


*/