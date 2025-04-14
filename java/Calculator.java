public class Calculator {
    public static void main(String[] args) {
        int x = 5;
        int y = 3;
        int result = x + y;
        System.out.println("The result is: " + result);
        if (x > y) {
            System.out.println("x is greater than y");
        } else if (x == y) {
            System.out.println("x is equal to y");
        } else {
            System.out.println("x is less than y");
        }
        for (int i = 0; i < 5; i++) {
            System.out.println("Hello, World!");
        }
        while (x > 0) {
            System.out.println("x is greater than 0");
            x--;
        }
        switch (x) {
            case 0:
                System.out.println("x is equal to 0");
                break;
            case 1:
                System.out.println("x is equal to 1");
                break;
            default:
                System.out.println("x is greater than 1");
        }
    }
}