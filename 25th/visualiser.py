import networkx as nx
import matplotlib.pyplot as plt

def read_graph_from_file(filename):
    """
    Reads a graph structure from a file and returns it as a dictionary.
    The file should contain lines with the structure:
    node: neighbor1 neighbor2 neighbor3
    """
    graph_input = {}
    with open(filename, 'r') as file:
        for line in file:
            if line.strip():  # Skip empty lines
                node, neighbors = line.split(":")
                graph_input[node.strip()] = neighbors.strip().split()
    return graph_input

# Filename for the input file
input_file = "test.txt"

# Read graph input from file
graph_input = read_graph_from_file(input_file)

# Create the graph
G = nx.Graph()

# Add edges to the graph
for node, neighbors in graph_input.items():
    for neighbor in neighbors:
        G.add_edge(node, neighbor)

# Visualize the graph
plt.figure(figsize=(10, 8))
nx.draw(
    G,
    with_labels=True,
    node_color="lightblue",
    node_size=3000,
    font_size=10,
    font_weight="bold",
    edge_color="gray",
)
plt.title("Ungerichteter Graph", fontsize=14)
plt.show()
