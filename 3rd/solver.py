import os;

def read_file(file_name = 'input.txt'):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, file_name)

    with open(file_path, 'r') as file:
        content =  [line.strip() for line in file.readlines()]
        
    return content

def mark_array(parts, i, j, symbol):
    # if i >= 0 and i < len(parts) and j >= 0 and j < len(parts[0]):
    parts[i][j] = symbol

    top = i - 1 >= 0
    bottom = i + 1 < len(parts)
    left = j - 1 >= 0
    right = j + 1 < len(parts[0])

    if top:
        parts[i - 1][j] = symbol
    if left:
        parts[i][j - 1] = symbol
    if bottom:
        parts[i + 1][j] = symbol
    if right:
        parts[i][j + 1] = symbol
    if top and left:
        parts[i - 1][j - 1] = symbol
    if top and right:
        parts[i - 1][j + 1] = symbol
    if bottom and left:
        parts[i + 1][j - 1] = symbol
    if bottom and right:
        parts[i + 1][j + 1] = symbol

def solver1 (input):
    row_length = len(input)
    col_length = len(input[0])

    numbers = [['.' for _ in range(col_length)] for _ in range(row_length)]
    parts = [[0 for _ in range(col_length)] for _ in range(row_length)]

    for i in range(len(input)):
        for j in range(len(input[i])):
            if input[i][j] != '.':
                if input[i][j] >= '0' and input[i][j] <= '9':
                    numbers[i][j] = input[i][j]
                else:
                    mark_array(parts, i, j, 1)

    part_sum = 0
    current_num = ""
    is_userd = False
    for i in range(len(numbers)):
        for j in range(len(numbers[i])):
            if numbers[i][j] != '.':
                current_num += numbers[i][j]
                if parts[i][j]:
                    is_userd = True
            else:
                if is_userd:
                    part_sum += int(current_num)
                current_num = ""
                is_userd = False
    
    return part_sum
                    
def solver2 (input):
    row_length = len(input)
    col_length = len(input[0])

    numbers = [['.' for _ in range(col_length)] for _ in range(row_length)]
    parts = [['.' for _ in range(col_length)] for _ in range(row_length)]

    for i in range(len(input)):
        for j in range(len(input[i])):
            if input[i][j] >= '0' and input[i][j] <= '9':
                numbers[i][j] = input[i][j]
            elif input[i][j] == '*':
                mark_array(parts, i, j, [i,j])

    gear_ratio = 0
    current_num = ""
    is_userd = False
    gear_i = 0
    gear_j = 0
    for i in range(len(numbers)):
        for j in range(len(numbers[i])):
            if numbers[i][j] != '.':
                current_num += numbers[i][j]
                if parts[i][j] != '.':
                    is_userd = True
                    gear_i = i
                    gear_j = j
            else:
                if is_userd:
                    if isinstance(parts[gear_i][gear_j], int):
                        gear_ratio += int(current_num) * parts[gear_i][gear_j]
                    else:
                        mark_array(parts, parts[gear_i][gear_j][0], parts[gear_i][gear_j][1], int(current_num))
                current_num = ""
                is_userd = False
    
    return gear_ratio


input = read_file()

print("1st Advent of Code")
print("1.1: ", solver1(input))
print("1.2: ", solver2(input))