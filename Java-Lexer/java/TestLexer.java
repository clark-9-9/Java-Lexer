/**
 * This is a test file for the Java lexical analyzer
 * It contains examples of all major token types
 */
public class TestLexer {
    // Single line comment for testing
    private static final int MAX_VALUE = 100;
    private double pi = 3.14159;
    private String greeting = "Hello, World!";
    private char letter = 'x';
    private boolean isActive = true;
    
    public static void main(String[] args) {
        // Variable declarations
        int count = 0;
        float price = 29.99f;
        
        // Arithmetic operators
        int sum = 10 + 20;
        int difference = 50 - 30;
        int product = 5 * 6;
        int quotient = 100 / 5;
        int remainder = 10 % 3;
        
        // Assignment operators
        int x = 5;
        x += 3;  // x = x + 3
        x -= 2;  // x = x - 2
        x *= 4;  // x = x * 4
        x /= 2;  // x = x / 2
        x %= 3;  // x = x % 3
        
        // Increment and decrement
        int a = 10;
        a++;
        int b = 20;
        b--;
        
        // Comparison operators
        boolean isEqual = (a == b);
        boolean isNotEqual = (a != b);
        boolean isGreater = (a > b);
        boolean isLess = (a < b);
        boolean isGreaterOrEqual = (a >= b);
        boolean isLessOrEqual = (a <= b);
        
        // Logical operators
        boolean result1 = true && false;
        boolean result2 = true || false;
        boolean result3 = !true;
        
        // Bitwise operators
        int bitwiseAnd = 12 & 5;
        int bitwiseOr = 12 | 5;
        int bitwiseXor = 12 ^ 5;
        int bitwiseComplement = ~5;
        int leftShift = 5 << 2;
        int rightShift = 20 >> 2;
        
        // Conditional statement (if-else)
        if (a > b) {
            System.out.println("a is greater than b");
        } else if (a < b) {
            System.out.println("a is less than b");
        } else {
            System.out.println("a is equal to b");
        }
        
        // Switch statement
        switch (a) {
            case 1:
                System.out.println("One");
                break;
            case 2:
                System.out.println("Two");
                break;
            default:
                System.out.println("Other");
                break;
        }
        
        // Loops
        for (int i = 0; i < 10; i++) {
            System.out.println(i);
        }
        
        while (count < 5) {
            count++;
        }
        
        do {
            count--;
        } while (count > 0);
        
        // Array declaration and initialization
        int[] numbers = { 1, 2, 3, 4, 5 };
        System.out.println(numbers[0]);
        
        // Exception handling
        try {
            int division = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
        } finally {
            System.out.println("Always executed");
        }
        
        // Enhanced for loop
        for (int number : numbers) {
            System.out.println(number);
        }
        
        // Testing various Java keywords
        final int constantValue = 100;
        
        // Lambda expression (Java 8+)
        Runnable runnable = () -> {
            System.out.println("Lambda expression");
        };
        
        // Method reference (Java 8+)
        java.util.function.Function<String, Integer> stringLength = String::length;
    }
    
    // Method with parameters and return type
    private int calculate(int a, int b) throws Exception {
        if (b == 0) {
            throw new Exception("Cannot divide by zero");
        }
        return a / b;
    }
    
    // Method with generics
    public <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.println(element);
        }
    }
    
    // Inner class
    private class InnerClass {
        public void display() {
            System.out.println("Inner class method");
        }
    }
    
    // Interface implementation
    interface MyInterface {
        void doSomething();
    }
    
    // Enum
    enum Status {
        ACTIVE, INACTIVE, PENDING
    }
}
