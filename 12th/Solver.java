
public class Solver {
    public static void main(String[] args) {
        Boolean test = true;

        String prefix = "12th/";

        String testFile = "test.txt";
        String inputFile = "input.txt";


        int multiplier = 5;

        InputConverter inputConverter = new InputConverter(prefix + (test ? testFile : inputFile), multiplier);
        System.out.println("-".repeat(50));
        System.out.println(inputConverter.countAllPositions());
        System.out.println("-".repeat(50));
    }
}