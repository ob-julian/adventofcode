import os;

enablePrint = False

def read_file(file_name = 'input.txt'):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, file_name)

    with open(file_path, 'r') as file:
        content =  [line.strip() for line in file.readlines()]
        
    return content

def print_map(array, markers = [], x = -1, y = -1):
    if not enablePrint:
        return
    for i in range(len(array)):
        for j in range(len(array[i])):
            if (i,j) in markers:
                # print in green
                print("\033[92m{}\033[00m".format(array[i][j]), end = '')
            elif type(array[i][j]) == int and array[i][j] > 0:
                # print in red
                print("\033[91m{}\033[00m".format(array[i][j]), end = '')
            elif i == x and j == y:
                # print in blue
                print("\033[94m{}\033[00m".format(array[i][j]), end = '')
            else:
                print(array[i][j], end = '')
        print()
    print("------------------")

def print_map_2(array):
    if not enablePrint:
        return
    for i in range(len(array)):
        for j in range(len(array[i])):
            if array[i][j] == 0:
                # blue
                print("\033[94m{}\033[00m".format(0), end = '')
            elif array[i][j] == 1:
                # print in red
                print("\033[91m{}\033[00m".format(1), end = '')
            elif array[i][j] == 2:
                print("#", end = '')
            elif array[i][j] == 3:
                # print in green
                print("\033[92m{}\033[00m".format(3), end = '')
            else:
                print(".", end = '')
        print()
    print("------------------")
            

def lookup_next_time(x,y, tile):
    #| is a vertical pipe connecting north and south.
    #- is a horizontal pipe connecting east and west.
    #L is a 90-degree bend connecting north and east.
    #J is a 90-degree bend connecting north and west.
    #7 is a 90-degree bend connecting south and west.
    #F is a 90-degree bend connecting south and east.
    #. is ground; there is no pipe in this tile.
    #S is the starting position of the animal; there is a pipe on this
    if tile == '|':
        return (x-1,y), (x+1,y)
    elif tile == '-':
        return (x,y-1), (x,y+1)
    elif tile == 'L':
        return (x-1,y), (x,y+1)
    elif tile == 'J':
        return (x-1,y), (x,y-1)
    elif tile == '7':
        return (x+1,y), (x,y-1)
    elif tile == 'F':
        return (x+1,y), (x,y+1)
    elif tile == 'S':
        print("Error: lookup_next_time for x,y,tile: ",x,y,tile)
        return (x,y), (x,y)
    else:
        if type(tile) == int:
            return (-1,-1), (-1,-1)
        else:
            print("Error: lookup_next_time for x,y,tile: ",x,y,tile)
            return (x,y)
        
def can_connect_horizontally(tile1, tile2):
    if tile1 == '-' or tile1 == 'L' or tile1 == 'F' or tile1 == 'S':
        if tile2 == '-' or tile2 == '7' or tile2 == 'J' or tile2 == 'S':
            return True
    return False

def can_connect_vertically(tile1, tile2):
    if tile1 == '|' or tile1 == '7' or tile1 == 'F' or tile1 == 'S':
        if tile2 == '|' or tile2 == 'L' or tile2 == 'J' or tile2 == 'S':
            return True
    return False

def can_connect(x1,y1,x2,y2,grid):
    f1 = grid[x1][y1]
    f2 = grid[x2][y2]
    #print("can_connect: ",x1,y1,x2,y2,f1,f2)
    if x1 == x2:
        if y1 < y2:
            return can_connect_horizontally(f1,f2)
        else:
            return can_connect_horizontally(f2,f1)
    elif y1 == y2:
        if x1 < x2:
            return can_connect_vertically(f1,f2)
        else:
            return can_connect_vertically(f2,f1)
    return False
 
def solver1 (input):
    pipgrid = [[0 for _ in range(len(input[0])+2)] for _ in range(len(input)+2)]
    org_x,org_y = 0,0
    for i in range(len(input)):
        for j in range(len(input[i])):
            if input[i][j] != '.':
                pipgrid[i+1][j+1] = input[i][j]
            if input[i][j] == 'S':
                org_x,org_y = i+1,j+1
                pipgrid[i+1][j+1] = 0
        
    
    distList = []
    if pipgrid[org_x-1][org_y] in ['|','7','F']:
        distList.append((org_x-1,org_y))
    if pipgrid[org_x+1][org_y] in ['|','L','J']:
        distList.append((org_x+1,org_y))
    if pipgrid[org_x][org_y-1] in ['-','L','F']:
        distList.append((org_x,org_y-1))
    if pipgrid[org_x][org_y+1] in ['-','7','J']:
        distList.append((org_x,org_y+1))
    
    dist = 0

    while True:
        #print_map(pipgrid, distList, org_x, org_y)
        dist += 1
        newDistList = []
        for i in range(len(distList)):
            x,y = distList[i]
            if pipgrid[x][y] != 0:
                if type(pipgrid[x][y]) == int:
                    #print_map(pipgrid, distList, org_x, org_y)
                    return pipgrid[x][y]
                new_1, new_2 = lookup_next_time(x,y,pipgrid[x][y])
                if type(pipgrid[new_1[0]][new_1[1]]) == str:
                    if(can_connect(x,y,new_1[0],new_1[1],pipgrid)):
                        #print("can connect")
                        newDistList.append(new_1)
                if type(pipgrid[new_2[0]][new_2[1]]) == str:
                    if(can_connect(x,y,new_2[0],new_2[1],pipgrid)):
                        #print("can connect")
                        newDistList.append(new_2)
                # scorched earth
                pipgrid[x][y] = dist

        if len(newDistList) == 0:
            return -1

        distList = newDistList

def get_path (input):
    pipgrid = [[0 for _ in range(len(input[0])+2)] for _ in range(len(input)+2)]
    org_x,org_y = 0,0
    for i in range(len(input)):
        for j in range(len(input[i])):
            if input[i][j] != '.':
                pipgrid[i+1][j+1] = input[i][j]
            if input[i][j] == 'S':
                org_x,org_y = i+1,j+1
                pipgrid[i+1][j+1] = 1
        
    
    distList = []
    if pipgrid[org_x-1][org_y] in ['|','7','F']:
        distList.append((org_x-1,org_y))
    if pipgrid[org_x+1][org_y] in ['|','L','J']:
        distList.append((org_x+1,org_y))
    if pipgrid[org_x][org_y-1] in ['-','L','F']:
        distList.append((org_x,org_y-1))
    if pipgrid[org_x][org_y+1] in ['-','7','J']:
        distList.append((org_x,org_y+1))
    
    dist = 0

    while True:
        #print_map(pipgrid, distList, org_x, org_y)
        dist += 1
        newDistList = []
        for i in range(len(distList)):
            x,y = distList[i]
            if pipgrid[x][y] != 0:
                if type(pipgrid[x][y]) == int:
                    print_map(pipgrid, distList, org_x, org_y)
                    return pipgrid
                new_1, new_2 = lookup_next_time(x,y,pipgrid[x][y])
                if type(pipgrid[new_1[0]][new_1[1]]) == str:
                    if(can_connect(x,y,new_1[0],new_1[1],pipgrid)):
                        #print("can connect")
                        newDistList.append(new_1)
                if type(pipgrid[new_2[0]][new_2[1]]) == str:
                    if(can_connect(x,y,new_2[0],new_2[1],pipgrid)):
                        #print("can connect")
                        newDistList.append(new_2)
                # scorched earth
                pipgrid[x][y] = 1

        if len(newDistList) == 0:
            return -1

        distList = newDistList
                    
def solver2 (input):
    pipgrid = [[0 for _ in range(len(input[0])+2)] for _ in range(len(input)+2)]
    for i in range(len(input)):
        for j in range(len(input[i])):
            if input[i][j] != '.':
                pipgrid[i+1][j+1] = input[i][j]

    maped_pipgrid = get_path(input)

    print_map_2(maped_pipgrid)

    for i in range(len(maped_pipgrid)):
        for j in range(len(maped_pipgrid[i])):
            if maped_pipgrid[i][j] != 1:
                pipgrid[i][j] = 0

    big_pip_grid = [[0 for _ in range(len(pipgrid[0])*2)] for _ in range(len(pipgrid)*2)]

    for i in range(len(pipgrid)):
        for j in range(len(pipgrid[0])):
            if pipgrid[i][j] != 0:
                big_pip_grid[2*i][2*j] = 2
                if can_connect(i,j,i+1,j,pipgrid):
                    big_pip_grid[2*i+1][2*j] = 2
                if can_connect(i,j,i,j+1,pipgrid):
                    big_pip_grid[2*i][2*j+1] = 2
            else:
                big_pip_grid[2*i][2*j] = 1

    print_map_2(big_pip_grid)

    lifo = []
    lifo.append((0,0))
    while len(lifo) > 0:
        x,y = lifo.pop()
        if big_pip_grid[x][y] < 2:
            big_pip_grid[x][y] = 3
            if x > 0 and big_pip_grid[x-1][y] < 2:
                lifo.append((x-1,y))
            if x < len(big_pip_grid)-1 and big_pip_grid[x+1][y] < 2:
                lifo.append((x+1,y))
            if y > 0 and big_pip_grid[x][y-1] < 2:
                lifo.append((x,y-1))
            if y < len(big_pip_grid[0])-1 and big_pip_grid[x][y+1] < 2:
                lifo.append((x,y+1))
            
    print_map_2(big_pip_grid)

    total = 0

    for i in range(len(big_pip_grid)):
        for j in range(len(big_pip_grid[i])):
            if big_pip_grid[i][j] == 1:
                total += 1

    return total


#input = read_file("testData1.txt")
input = read_file()

print("10th Advent of Code")
print("1: ", solver1(input))
print("2: ", solver2(input))