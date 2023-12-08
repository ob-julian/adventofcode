package src;

import java.math.BigInteger;
import java.util.Arrays;

public class Solver {
    public static void main(String[] args) {
        //String inputFile = "testData2.txt";
        String inputFile = "input.txt"; 

        String input = FileReader.readFileSync(inputFile);
        String[] linesAll = input.split("\n");

        String path = linesAll[0].trim();

        String[] lines = Arrays.copyOfRange(linesAll, 2, linesAll.length);

        String[] allNodes = new String[lines.length];

        String[][] allNodesWithChildren = new String[lines.length][3]; // [node, child1, child2]

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String[] values = line.split(" = ");
            String[] children = values[1].replaceAll("[()]", "").split(", ");
            allNodes[i] = values[0];
            allNodesWithChildren[i][0] = values[0];
            allNodesWithChildren[i][1] = children[0];
            allNodesWithChildren[i][2] = children[1];
        }

        Network network = new Network(allNodes);
        for (int i = 0; i < allNodesWithChildren.length; i++) {
            String[] nodeWithChildren = allNodesWithChildren[i];
            String node = nodeWithChildren[0].trim();
            String child1 = nodeWithChildren[1].trim();
            String child2 = nodeWithChildren[2].trim();
            network.addEdges(node, child1, child2);
        }

        int step1 = network.getNumbersOfSteps("AAA", "ZZZ", path);
        BigInteger step2 = network.getNumbersOfStepsForMultipleNodesAdvamced("A", "Z", path);

        System.out.println("8th   Advent of Code");
        System.out.println("1: " + step1);
        System.out.println("2: " + step2);
    }
}