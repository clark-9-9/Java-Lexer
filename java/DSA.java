import java.util.Arrays;
import java.util.Stack;

// nothing
public class DSA {
    boolean isTrue = true;
    // boolean isTrue = true;
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