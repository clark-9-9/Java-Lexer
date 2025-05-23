function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const javaOperators = [
    "+",
    "-",
    "*",
    "/",
    "%",
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
    "++",
    "--",
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
    "~",
    "<<",
    ">>",
    ">>>",
    "?",
    ":",
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
    "]",
    ";",
    ",",
    ".",
    "@",
    "...",
    "::",
];

export const patterns = {
    // Matches any keyword
    KEYWORD: {
        regex: new RegExp(`^(${javaKeywords.join("|")})$`),
        type: "KEYWORD",
    },

    // Matches any operator
    OPERATOR: {
        regex: new RegExp(`^(${javaOperators.map(escapeRegex).join("|")})$`),
        type: "OPERATOR",
    },

    // Matches any separator
    SEPARATOR: {
        regex: new RegExp(`^(${javaSeparators.map(escapeRegex).join("|")})$`),
        type: "SEPARATOR",
    },

    // Matches string literals
    STRING_LITERAL: {
        // regex: /^"(?:[^"\\]|\\.)*"$/,
        regex: /^".*"$/,
        type: "STRING_LITERAL",
    },

    // Matches valid identifiers
    Identifier: {
        regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
        type: "Identifier",
    },

    // Matches numbers (integers or decimals)
    NUMBER: {
        regex: /^\d+(\.\d+)?$/,
        type: "NUMBER",
    },
};
