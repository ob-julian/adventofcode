import networkx as nx

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
input_file = "input.txt"


# Read graph input from file
graph_input = read_graph_from_file(input_file)

# Create the graph
G = nx.Graph()

# Add edges to the graph
for node, neighbors in graph_input.items():
    for neighbor in neighbors:
        G.add_edge(node, neighbor)

nx.set_edge_attributes(G, False, "visited")
nx.set_node_attributes(G, False, "visited")
nx.set_node_attributes(G, None, "parent")
nx.set_node_attributes(G, None, "groupIndex")

def tiefensuche(graph, queue, index, search_node, last_node=None):
    print(f"Checking node {queue} ffrom {last_node}")
    # recursive check
    if last_node is not None:
        posible_edge = graph.get_edge_data(queue, last_node)


        if posible_edge is None:
            # just to be shure
            print(f"Node {queue} is not connected to {last_node}")
            return 0

        # recursive end
        if posible_edge["visited"] == index:
            print(f"Node {queue} is already visited")
            return 0
        if queue == search_node:
            print(f"Node {queue} is the search node")
            return 1

        # recursive
        posible_edge["visited"] = index

    if queue != search_node:
        graph.nodes[queue]["visited"] = index

    # recursive part
    counter = 0
    for neighbor in graph.neighbors(queue):
        edge = graph.get_edge_data(queue, neighbor)
        edge["visited"] = index
        counter += tiefensuche(graph, neighbor, index, search_node, queue)
    return counter


def breitensuche(graph, start_node, search_node):
    queue = [start_node]
    visited_nodes = []
    found = False
    while len(queue) > 0:
        node = queue.pop(0)
        parent = graph.nodes[node]["parent"]

        graph.nodes[node]["visited"] = True
        visited_nodes.append(node)

        edge = graph.get_edge_data(node, parent)
        if edge is not None and not edge["visited"]:
            if node == search_node:
                found = True
                break

        for neighbor in graph.neighbors(node):
            if neighbor == parent:
                continue
            edge = graph.get_edge_data(node, neighbor)
            if not edge["visited"] and not graph.nodes[neighbor]["visited"] and neighbor not in queue:
                graph.nodes[neighbor]["parent"] = node
                queue.append(neighbor)
    for node in visited_nodes:
        graph.nodes[node]["visited"] = False
    if found:
        node = search_node
        while start_node != node:
            parent = graph.nodes[node]["parent"]
            edge = graph.get_edge_data(node, parent)
            edge["visited"] = True
            node = parent

    return found


def count_amount_of_unique_paths(graph, start_node, search_node):
    count = 0
    while breitensuche(graph, start_node, search_node):
        count += 1
    # reset
    for edge in graph.edges:
        graph.edges[edge]["visited"] = False
    return count

def count_max_4_paths(graph, start_node, search_node):
    # at the end of the day we just need to know if there are more than 3 paths
    count = 0
    while breitensuche(graph, start_node, search_node):
        count += 1
        if count > 3:
            break
    # reset
    for edge in graph.edges:
        graph.edges[edge]["visited"] = False
    return count

#index = 1
#node = "rsh"
#search_node = "nvd"
#paths = count_amount_of_unique_paths(G, node, search_node)

#print(f"Node {node} is connected to {search_node} with {paths} unique path(s)")
def cheated_way_by_menas_of_pyplot_visualisation():
    paris = [("sjr", "jlt"), ("zqg", "mhb"), ("mzb", "fjn")]
    for pair in paris:
        edge = G.get_edge_data(pair[0], pair[1])
        if edge is None:
            print(f"Edge {pair} does not exist")
            continue
        # remove edge
        G.remove_edge(pair[0], pair[1])

    def get_subgraph_size(graph, start_node):
        queue = [start_node]
        visited_nodes = []
        while len(queue) > 0:
            node = queue.pop(0)
            visited_nodes.append(node)
            for neighbor in graph.neighbors(node):
                if neighbor not in visited_nodes and neighbor not in queue:
                    queue.append(neighbor)
        return len(visited_nodes)

    print(get_subgraph_size(G, paris[0][0]) * get_subgraph_size(G, paris[0][1]))


def solve():
    grouping = []
    grouping_index = 0
    #used_nodes = []
    iter = 0
    for node in G.nodes:
        #used_nodes.append(node)
        print(f"Checking all for node {iter}")
        iter += 1
        for search_node in G.nodes:
            #if search_node in used_nodes:
            #    continue
            if node == search_node:
                continue
            paths = count_max_4_paths(G, node, search_node)

            if paths > 3:
                node_group = G.nodes[node]["groupIndex"]
                search_node_group = G.nodes[search_node]["groupIndex"]

                # both not grouped
                if node_group is None and search_node_group is None:
                    G.nodes[node]["groupIndex"] = grouping_index
                    G.nodes[search_node]["groupIndex"] = grouping_index
                    grouping.append({node, search_node})
                    grouping_index += 1
                # both grouped
                elif node_group is not None and search_node_group is not None:
                    if node_group != search_node_group:
                        # merge
                        bigger_group = node_group
                        smaller_group = search_node_group
                        if len(grouping[bigger_group]) < len(grouping[smaller_group]):
                            bigger_group, smaller_group = smaller_group, bigger_group
                        for n in grouping[smaller_group]:
                            G.nodes[n]["groupIndex"] = bigger_group
                        grouping[bigger_group].update(grouping[smaller_group])
                        del grouping[smaller_group]
                # one grouped
                else:
                    if node_group is not None:
                        G.nodes[search_node]["groupIndex"] = node_group
                        grouping[node_group].add(search_node)
                    else:
                        G.nodes[node]["groupIndex"] = search_node_group
                        grouping[search_node_group].add(node)

    multiplicative = 1
    for group in grouping:
        size = len(group)
        if size > 0:
            print(f"Group {group} has size {size}")
            multiplicative *= size

    print(multiplicative)

#solve()
cheated_way_by_menas_of_pyplot_visualisation()