export const javaOperators = [
    // Arithmetic
    "+",
    "-",
    "*",
    "/",
    "%",
    // Assignment
    "=",
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
    // Increment/Decrement
    "++",
    "--",
    // Relational
    "==",
    "!=",
    ">",
    "<",
    ">=",
    "<=",
    // Logical
    "&&",
    "||",
    "!",
    // Bitwise
    "&",
    "|",
    "^",
    "~",
    "<<",
    ">>",
    ">>>",
    // Ternary
    "?",
    ":",
    // Lambda / Method Reference
    "->",
    "::",
];
export const javaKeywords = [
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
export const javaSeparators = [
    "(",
    ")",
    "{",
    "}",
    "[",
    "]", // Brackets
    ";",
    ",",
    ".", // Statement-related
    "@", // Annotation
    "...",
    "::", // Varargs and method reference
];
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
// Remove multi-line comments first
// const noMultilineComments = inputText.replace(/\/\*[\s\S]*?\*\//g, "");
// Remove single-line comments
// const noComments = noMultilineComments.replace(/\/\/.*/g, "");
