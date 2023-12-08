package src;
import java.util.Map;
import java.util.stream.Stream;
import java.util.HashMap;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;

public class Network {
    
    Map<String, Node> nodeMap;

    public Network(String[] values) {
        this.nodeMap = new HashMap<String, Node>();
        for (String value : values) {
            this.nodeMap.put(value, new Node(value));
        }
    }

    public void addEdges(String parent, String childLeft, String childRight) {
        Node parentNode = this.nodeMap.get(parent);
        Node childLeftNode = this.nodeMap.get(childLeft);
        Node childRightNode = this.nodeMap.get(childRight);

        parentNode.left = childLeftNode;
        parentNode.right = childRightNode;
    }

    public int getNumbersOfSteps(String start, String end, String path) {
        if (start.equals(end)) {
            return 0;
        }
        Node startNode = this.nodeMap.get(start);
        Node endNode = this.nodeMap.get(end);

        if (startNode == null || endNode == null) {
            return 0;
        }

        int steps = 0;
        
        do{
            String direction;
            direction = path.substring(steps % path.length(), steps % path.length() + 1);
            if (direction.equals("L")) {
                startNode = startNode.left;
            } else {
                startNode = startNode.right;
            }
            steps++;
        } while (startNode != endNode);

        return steps;
    }

    public BigInteger getNumbersOfStepsForMultipleNodes(String startEnd, String endEnd, String path) {
        if (startEnd.equals(endEnd)) {
            return BigInteger.ZERO;
        }
        ArrayList<Node> startNodes = new ArrayList<Node>();

        for (String key : this.nodeMap.keySet()) {
            if (key.endsWith(startEnd)) {
                startNodes.add(this.nodeMap.get(key));
            }
        }

        if (startNodes.size() == 0) {
            return BigInteger.ZERO;
        }



        BigInteger steps = BigInteger.ZERO;

        ArrayList<Node> copyStartNodes = new ArrayList<>();
        copyStartNodes.addAll(startNodes);


        
        do{
            String direction;
            //direction = path.substring(steps % path.length(), steps % path.length() + 1);
            direction = path.substring(steps.mod(BigInteger.valueOf(path.length())).intValue(), steps.mod(BigInteger.valueOf(path.length())).intValue() + 1);
            if (direction.equals("L")) {
                for (int i = 0; i < startNodes.size(); i++) {
                    Node node = startNodes.get(i);
                    startNodes.set(i, node.left);
                }
            } else {
                for (int i = 0; i < startNodes.size(); i++) {
                    Node node = startNodes.get(i);
                    startNodes.set(i, node.right);
                }
            }
            //steps++;
            steps = steps.add(BigInteger.ONE);
            
            //loop detection
            if (copyStartNodes.get(0).value.equals(startNodes.get(0).value)) {
                //if (steps % path.length() == 0) {
                if (steps.mod(BigInteger.valueOf(path.length())).intValue() == 0) {
                    System.out.println("loop detected");
                    return BigInteger.ZERO;
                }
            }
        } while (!startNodes.stream().allMatch(node -> node.value.endsWith(endEnd)));

        return steps;
    }

    public BigInteger getNumbersOfStepsForMultipleNodesAdvamced(String startEnd, String endEnd, String path) {
        if (startEnd.equals(endEnd)) {
            return BigInteger.ZERO;
        }
        ArrayList<Node> startNodes = new ArrayList<Node>();

        for (String key : this.nodeMap.keySet()) {
            if (key.endsWith(startEnd)) {
                startNodes.add(this.nodeMap.get(key));
            }
        }

        if (startNodes.size() == 0) {
            return BigInteger.ZERO;
        }

        Object[][] destionations = new Object[startNodes.size()][2]; // [node, steps]


        BigInteger steps = BigInteger.ZERO;

        ArrayList<Node> copyStartNodes = new ArrayList<>();
        copyStartNodes.addAll(startNodes);

        boolean exitCondition = true;
        
        do{
            String direction;
            //direction = path.substring(steps % path.length(), steps % path.length() + 1);
            direction = path.substring(steps.mod(BigInteger.valueOf(path.length())).intValue(), steps.mod(BigInteger.valueOf(path.length())).intValue() + 1);

            if (direction.equals("L")) {
                for (int i = 0; i < startNodes.size(); i++) {
                    Node node = startNodes.get(i);
                    startNodes.set(i, node.left);
                }
            } else {
                for (int i = 0; i < startNodes.size(); i++) {
                    Node node = startNodes.get(i);
                    startNodes.set(i, node.right);
                }
            }
            
            //steps++;
            steps = steps.add(BigInteger.ONE);
            
            for (int i = 0; i < startNodes.size(); i++) {
                if (startNodes.get(i).value.endsWith(endEnd)) {
                    Node node = startNodes.get(i);
                    // possible destination
                    Stream<Object> stream = Arrays.stream(destionations).map(destination -> destination[0]).filter(destination -> destination != null);
                    if (stream.anyMatch(destination -> destination.equals(node))) {
                        // destination already in list
                        Object[] destination = destionations[i];
                        BigInteger destinationSteps = (BigInteger) destination[1];
                        if (steps.mod(destinationSteps).equals(BigInteger.ZERO)) {
                            // loop detected
                            // remove node from list
                            startNodes.remove(i);
                        }
                        else {
                            // new destination found
                            System.out.println("new ignored destination found at step " + steps);
                        }
                    } else {
                        // new destination found
                        destionations[i][0] = node;
                        destionations[i][1] = steps;
                    }
                }
            }

            if (startNodes.size() == 0) {
                exitCondition = false;
            }

            
            

        } while (exitCondition);

        // return LMC () of all steps (destionations[][1])

        BigInteger lmc = BigInteger.ONE;

        for (int i = 0; i < destionations.length; i++) {
            Object[] destination = destionations[i];
            if (destination[1] != null) {
                BigInteger destinationSteps = (BigInteger) destination[1];
                lmc = lmc.multiply(destinationSteps).divide(lmc.gcd(destinationSteps));

            }
        }
        return lmc;
    }
}
