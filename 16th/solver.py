import os;
import networkx as nx
import matplotlib.pyplot as plt

class Direction:
    def __init__(self, x, y, direction, grid_x, grid_y):
        self.x = x
        self.y = y
        self.direction = direction
        self.grid_x = grid_x
        self.grid_y = grid_y

    def add(self, x, y):
        self.x += x
        self.y += y

    def __add__(self, other):
        self.add(other.x, other.y)
        return self

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"({self.x}, {self.y})"
    
    def duplicate(self):
        return Direction(self.x, self.y, self.direction, self.grid_x, self.grid_y)
    
    def continue_instruction(self):
        if self.direction == ">":
            self.add(1, 0)
        elif self.direction == "<":
            self.add(-1, 0)
        elif self.direction == "^":
            self.add(0, -1)
        elif self.direction == "v":
            self.add(0, 1)
        if self.x < 0 or self.y < 0 or self.x >= self.grid_x or self.y >= self.grid_y:
            return None
        return self

    def insturction(self, symbol):
        if symbol == ".":
            return [self.continue_instruction()]
        if symbol == "\\":
            if self.direction == ">":
                self.direction = "v"
            elif self.direction == "<":
                self.direction = "^"
            elif self.direction == "^":
                self.direction = "<"
            elif self.direction == "v":
                self.direction = ">"
            return [self.continue_instruction()]
        if symbol == "/":
            if self.direction == ">":
                self.direction = "^"
            elif self.direction == "<":
                self.direction = "v"
            elif self.direction == "^":
                self.direction = ">"
            elif self.direction == "v":
                self.direction = "<"
            return [self.continue_instruction()]

        if symbol == "|":
            if self.direction in ["^", "v"]:
                return [self.continue_instruction()]
            #else
            new_direction = self.duplicate()
            new_direction.direction = "^"
            self.direction = "v"
            return [self.continue_instruction(), new_direction.continue_instruction()]
        if symbol == "-":
            if self.direction in [">", "<"]:
                return [self.continue_instruction()]
            #else
            new_direction = self.duplicate()
            new_direction.direction = ">"
            self.direction = "<"
            return [self.continue_instruction(), new_direction.continue_instruction()]
        # fallback
        print("error symbol " + symbol + " not recognized")
        return [None]

def read_file(file_name = 'input.txt'):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, file_name)

    with open(file_path, 'r') as file:
        content =  [line.strip() for line in file.readlines()]

    return content

def parse_input(input):
    grid = []
    for line in input:
        grid.append(list(line))
    return grid


def print_array(array):
    max_length = 0
    for row in array:
        for tile in row:
            if len(tile) > max_length:
                max_length = len(tile)
    print(max_length)
    for row in array:
        for tile in row:
            for item in tile:
                print(item, end="")
            for _ in range(max_length - len(tile)):
                print(" ", end="")
            print(" ", end="")
        print()

def solver1 (input):
    return solve_with_starting_position(input, 0, 0, ">")

def solve_with_starting_position(input, x, y, direction):
    grid = input
    energy_grid = []
    # pylint: disable=consider-using-enumerate
    for i in range(len(grid)):
        energy_grid.append([])
        for _ in range(len(grid[i])):
            energy_grid[i].append([])


    lase_queue = [Direction(x, y, direction, len(grid[0]), len(grid))]
    while len(lase_queue) > 0:
        current_direction = lase_queue.pop()
        init_x = current_direction.x
        init_y = current_direction.y
        init_direction = current_direction.direction
        if current_direction is None:
            # just to be shure
            continue
        if current_direction.direction in energy_grid[init_y][init_x]:
            # a lase in the same direction already passed here
            continue
        resulting_directions = current_direction.insturction(grid[init_y][init_x])
        # mark the current tile as energized
        energy_grid[init_y][init_x].append(init_direction)
        for direction in resulting_directions:
            if direction is not None:
                lase_queue.append(direction)
    #print_array(energy_grid)
    return count_energized_tiles(energy_grid)
        

def count_energized_tiles(grid):
    energized_tiles = 0
    for row in grid:
        for tile in row:
            if len(tile) > 0:
                energized_tiles += 1
    return energized_tiles

def solver2 (input):
    maximum = 0
    for i in range(len(input)):
        maximum = max(maximum, solve_with_starting_position(input, 0, i, ">"))
        maximum = max(maximum, solve_with_starting_position(input, len(input[0]) - 1, i, "<"))

    for i in range(len(input[0])):
        maximum = max(maximum, solve_with_starting_position(input, i, 0, "v"))
        maximum = max(maximum, solve_with_starting_position(input, i, len(input) - 1, "^"))
    return maximum

parsed_input = parse_input(read_file("input.txt"))
#parsed_input = parse_input(read_file("testData.txt"))

print("16th Advent of Code")
print("1: ", solver1(parsed_input))
print("2: ", solver2(parsed_input))
