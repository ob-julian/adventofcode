package src;

public class Node implements Comparable<Node> {
    
    public String value;
    public Node left;
    public Node right;

    public Node(String value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    public String toString() {
        return this.value;
    }

    public String toTreeString() {
        String leftString = this.left == null ? "null" : this.left.toTreeString();
        String rightString = this.right == null ? "null" : this.right.toTreeString();
        return "(" + this.value + " " + leftString + " " + rightString + ")";
    }


    @Override
    public int compareTo(Node o) {
        return this.value.compareTo(o.value);
    }
}
