import { parse, BaseJavaCstVisitorWithDefaults, } from "java-parser";
import fs from "fs";
import path from "path";
// Create a custom visitor to extract tokens
class JavaTokenVisitor extends BaseJavaCstVisitorWithDefaults {
    tokens = [];
    constructor() {
        super();
    }
    /*
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
        */
    visit(ctx) {
        const stack = [ctx];
        // console.log("ctx", ctx);
        while (stack.length > 0) {
            const current = stack.pop();
            if (current && current.image) {
                this.tokens.push({
                    type: current.tokenType?.name || "unknown",
                    value: current.image,
                    startLine: current.startLine,
                    startColumn: current.startColumn,
                });
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
            // console.log("ctx", ctx);
        }
    }
}
// const javaText = `
// public class HelloWorldExample {
//     public static void main(String args[]) {
//         System.out.println("Hello World!");
//     }
// }`;
const javaText = `
import java.util.Arrays;
import java.util.Stack;

// nothing
// dsfsaf
public class DSA {
    boolean isTrue = true;
    int[] arr = {1,2,3,4,5};
    double pi = 3.14;
    public static void main(String[] args) {
        reverseArray();
    }

    static boolean matchingPars(String str) {
        Stack<Character> stack = new Stack<>();

        for(int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            boolean open = ch == '(' || ch == '[' || ch == '{';
            boolean close = ch == ')' || ch == ']' || ch == '}';

            if(!open && !close) continue;
            if(close && stack.isEmpty()) return false;

            if(open) {
                stack.push(ch);
            } else {
                char last = stack.pop();

                if(
                    ((last == '(') && (ch != ')')) ||
                    ((last == '{') && (ch != '}')) ||
                    ((last == '[') && (ch != ']')) 
                ) {
                    return false;
                } 
            }
        }

        if(!stack.isEmpty()) return false;
        return true;
    }


    static void convertDecimalToBinary() {
        int num = 55;
        Stack<Integer> stack = new Stack<>();

        while(num != 0) {
            int calc = num % 2;
            stack.push(calc);
            num = num / 2;
        } 

        while(stack.size() != 0) {
            System.out.print(stack.pop());
        }
    }

    static void reverseArray() {
        int[] arr = {1,2,3,4,5,6};
        Stack<Integer> stack = new Stack<>();

        for(int ele: arr) {
            stack.push(ele);
        }

        for(int i = 0; i < arr.length; i++) {
            arr[i] = stack.pop();
        }

        System.out.println(
            Arrays.toString(arr)
        );
    int[] arr = {1,2,3,4,5};

    }
}

/* 
    String s = "()";
    Output: true;
    
    s = "()[]{}";
    Output: true;
    
    s = "(]";
    Output: false;
    
    s = "{[]}";
    Output: true;
    
    s = "([)]";
    Output:false 
    
    s = "}][{";
    Output:false 
    
    s = "{][{";
    Output:false 
    
    s = "[";
    Output:false 
*/
`;
try {
    // Parse the code
    const cst = parse(javaText);
    // Create and use our visitor
    const visitor = new JavaTokenVisitor();
    visitor.visit(cst);
    /*
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
    */
    fs.writeFileSync(path.join(process.cwd(), "data", "token", "DSA_tokens_2.json"), JSON.stringify(visitor.tokens, null, 2), {
        encoding: "utf-8",
        flag: "a+",
    });
}
catch (error) {
    console.error("Parsing error:", error);
}
// fs.writeFileSync("test_java_parser.txt", tokens, "utf-8");
const filePath = path.join(process.cwd(), "java", "DSA.java");
const inputText = fs.readFileSync(filePath, "utf8");
// console.log("------------------------------");
// const test = parse(inputText);
// function isToken(node: any): boolean {
//     return node && node.image !== undefined && node.tokenType !== undefined;
// }
// // Parse and traverse the CST
// try {
//     const cst = parse(inputText);
//     // Create a function to traverse the CST
//     function traverseCST(node: any) {
//         // If it's a token, print it
//         if (isToken(node)) {
//             console.log("Found Token:", {
//                 type: node.tokenType.name,
//                 value: node.image,
//                 line: node.startLine,
//                 column: node.startColumn,
//             });
//             return;
//         }
//         // If it has children, traverse them
//         if (node && node.children) {
//             Object.values(node.children).forEach((child) => {
//                 if (Array.isArray(child)) {
//                     child.forEach((item) => traverseCST(item));
//                 } else {
//                     traverseCST(child);
//                 }
//             });
//         }
//     }
//     // Start traversing from the root
//     // traverseCST(cst);
// } catch (error) {
//     console.error("Parsing error:", error);
// }
