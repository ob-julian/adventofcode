#FILE = "test.txt"
import time


FILE = "input.txt"

REPLACEMENTS = {
    "#": 0,
    ".": 1,
}

def read_inout (file):
    with open(file) as f:
        lines = f.readlines()
    return lines


def parse_input(lines):
    def generate_pattern():
        return {
            "length_horizontal": 0,
            "length_vertical": 0,
            "pattern_horizontal": [],
            "pattern_vertical": [],
        }
    pattern = []
    current_pattern = generate_pattern()
    has_length = False
    pattern.append(current_pattern)
    for line in lines:
        if line == "\n":
            current_pattern = generate_pattern()
            pattern.append(current_pattern)
            has_length = False
            continue

        line = line.strip()
        binary_value = 0
        for c in line:
            binary_value = (binary_value << 1) | REPLACEMENTS[c]

        if not has_length:
            current_pattern["length_horizontal"] = len(line)
            current_pattern["pattern_vertical"] = [0] * current_pattern["length_horizontal"]
            has_length = True

        # vertical
        current_pattern["pattern_horizontal"].append(binary_value)
        # horizontal
        for i in range(current_pattern["length_horizontal"]):
            current_pattern["pattern_vertical"][i] = (current_pattern["pattern_vertical"][i] << 1) | ((binary_value >> i) & 1)
        current_pattern["length_vertical"] += 1
    #print_patterns(pattern)
    return pattern

def find_mirror_points(line, length):
    inverse_line = reverse_binary(line, length)
    mirror_points = []
    for i in range(1, length):
        min_length = min(i, length - i)
        # using length - i or i is irrelevant, because we go through all possible mirror points anyway
        # we just need to be careful what number we ultimately add to the mirror_points list
        mirror_left = cut_binary(right_shift(line, length - i), min_length)
        mirror_right = cut_binary(right_shift(inverse_line, i), min_length)
        #print(bin_to_readable(mirror_left, min_length), bin_to_readable(mirror_right, min_length))
        if mirror_left == mirror_right:
            # because we use right shift, the mirror point is the right one
            mirror_points.append(i)
    #print(mirror_points)
    return mirror_points

def find_smudge_points(line, length):
    inverse_line = reverse_binary(line, length)
    mirror_points = []
    for i in range(1, length):
        min_length = min(i, length - i)
        mirror_left = cut_binary(right_shift(line, length - i), min_length)
        mirror_right = cut_binary(right_shift(inverse_line, i), min_length)
        #print(bin_to_readable(mirror_left, min_length), bin_to_readable(mirror_right, min_length))
        # the xor has exaclty one bit different if it is smudged
        if count_bin_ones(mirror_left ^ mirror_right) == 1:
            mirror_points.append(i)
    return mirror_points

def right_shift(integer, length, ):
    return integer >> length

def reverse_binary(integer, length):
    reversed_integer = 0
    for i in range(length):
        reversed_integer = (reversed_integer << 1) | (integer & 1)
        integer >>= 1
    return reversed_integer

def ones(length):
    return (1 << length) - 1

def cut_binary(integer, length):
    return integer & ones(length)

def find_all_horizontal_mirror_points(pattern_obj):
    return find_all_wrapper(pattern_obj, "length_horizontal", "pattern_horizontal", find_mirror_points_in_pattern)

def find_all_vertical_mirror_points(pattern_obj):
    return find_all_wrapper(pattern_obj, "length_vertical", "pattern_vertical", find_mirror_points_in_pattern)

def find_all_horizontal_smudge_points(pattern_obj):
    return find_all_wrapper(pattern_obj, "length_horizontal", "pattern_horizontal", find_smudge_points_in_pattern)

def find_all_vertical_smudge_points(pattern_obj):
    return find_all_wrapper(pattern_obj, "length_vertical", "pattern_vertical", find_smudge_points_in_pattern)

def find_all_wrapper(pattern_obj, length_name, pattern_name, function):
    length = pattern_obj[length_name]
    pattern = pattern_obj[pattern_name]
    return function(pattern, length)


def find_mirror_points_in_pattern(pattern, length):
    '''
    find all mirror points in a single pattern
    '''
    mirror_points = find_mirror_points(pattern[0], length)
    for i in range(1, len(pattern)):
        mirror_points = intersect(mirror_points, find_mirror_points(pattern[i], length))
    if len(mirror_points) == 0:
        return [0]
    return mirror_points

def intersect(a, b):
    return list(set(a) & set(b))

def find_smudge_points_in_pattern(pattern, length):
    # pylint: disable=consider-using-enumerate
    for i in range(len(pattern)):
        mirror_points = find_smudge_points(pattern[i], length)
        if len(mirror_points) == 0:
            # no possible mirror points
            continue
        for j in range(len(pattern)):
            if i == j:
                # do not compare with itself
                continue
            mirror_points = intersect(mirror_points, find_mirror_points(pattern[j], length))
        if len(mirror_points) == 1:
            return mirror_points
    return [0]

def count_bin_ones(integer):
    count = 0
    while integer:
        count += integer & 1
        integer >>= 1
    return count


# debugging functions

def bin_to_readable(binary, length):
    string = bin(binary).replace("0b", "").rjust(length, "0")
    return string.replace("1", ".").replace("0", "#")

def print_patterns(patterns):
    for pattern in patterns:
        print_pattern_obj(pattern)

def print_pattern_obj(pattern_obj):
    vertical = pattern_obj["pattern_vertical"]
    horizontal = pattern_obj["pattern_horizontal"]
    length_horizontal = pattern_obj["length_horizontal"]
    length_vertical = pattern_obj["length_vertical"]
    print_pattern(horizontal, length_horizontal)
    print()
    print_pattern(vertical, length_vertical)
    print()
    
def print_pattern(pattern, length):
    for line in pattern:
        print(bin_to_readable(line, length))

# main functions

def solve(file):
    start_time = time.time()
    lines = read_inout(file)
    print("Read file in", get_mili_seconds(start_time), "ms")
    pattern = parse_input(lines)
    print("Parsed input in", get_mili_seconds(start_time), "ms")
    cumulated_mirror_points_1 = solve_part1(pattern)
    print("Part 1:", cumulated_mirror_points_1, "in", get_mili_seconds(start_time), "ms")
    cumulated_mirror_points_2 = solve_part2(pattern)
    print("Part 2:", cumulated_mirror_points_2, "in", get_mili_seconds(start_time), "ms")

def get_mili_seconds(start_time):
    return (time.time() - start_time) * 1000

def solve_part1(pattern):
    cumulated_mirror_points = 0
    for pattern_obj in pattern:
        vertical = find_all_vertical_mirror_points(pattern_obj)
        if len(vertical) > 1:
            print("Vertical mirror points are not unique")
            return
        horizontal = find_all_horizontal_mirror_points(pattern_obj)
        if len(horizontal) > 1:
            print("Horizontal mirror points are not unique")
            return
        cumulated_mirror_points += vertical[0] * 100 + horizontal[0]
    return cumulated_mirror_points


def solve_part2(pattern):
    cumulated_mirror_points = 0
    for pattern_obj in pattern:
        vertical = find_all_vertical_smudge_points(pattern_obj)
        if len(vertical) > 1:
            print("Vertical mirror points are not unique")
            return
        horizontal = find_all_horizontal_smudge_points(pattern_obj)
        if len(horizontal) > 1:
            print("Horizontal mirror points are not unique")
            return
        cumulated_mirror_points += vertical[0] * 100 + horizontal[0]
    return cumulated_mirror_points

solve(FILE)