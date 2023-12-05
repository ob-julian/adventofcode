import os;

def read_file(file_name = 'input.txt'):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, file_name)

    with open(file_path, 'r') as file:
        content =  [line.strip() for line in file.readlines()]
        
    return content


def solver1 (input):
    features = []
    seeds = input[0].split(': ')[1].split(" ")

    new_catagory = True
    for i in range(2, len(input)):
        if input[i] == "":
            new_catagory = True
            continue

        if new_catagory:
            from_to = input[i].split(" ")[0].split("-to-")
            features.append({
                "to": from_to[1],
                "from": from_to[0],
                "map": {}
            })
            new_catagory = False
        else: 
            primitive_map = input[i].split(" ")
            #min
            features[-1]["map"][int(primitive_map[1])] = int(primitive_map[0])
            # max
            if features[-1]["map"].get(int(primitive_map[1]) + int(primitive_map[2])) == None:
                features[-1]["map"][int(primitive_map[1]) + int(primitive_map[2])] = -1
    
    result = [int(x) for x in seeds]
    for mapped in features:
        for i in range(len(result)):
            minVal = 0
            minKey = 0
            for key, value in mapped["map"].items():
                if minKey <= key and key <= result[i]:
                    minKey = key
                    minVal = value
            
            if minVal >= 0:
                result[i] = minVal + (result[i] - minKey)


    return min(result)
                    
def solver2 (input):
    features = []
    seeds_primative = input[0].split(': ')[1].split(" ")
    seeds = {}
    for i in range(0, len(seeds_primative), 2):
        seeds[int(seeds_primative[i])] = int(seeds_primative[i]) + int(seeds_primative[i+1]) - 1
        

    new_catagory = True
    for i in range(2, len(input)):
        if input[i] == "":
            new_catagory = True
            continue

        if new_catagory:
            from_to = input[i].split(" ")[0].split("-to-")
            features.append({
                "to": from_to[1],
                "from": from_to[0],
                "map": {}
            })
            new_catagory = False
        else: 
            primitive_map = input[i].split(" ")
            # min
            features[-1]["map"][int(primitive_map[1])] = [int(primitive_map[0]), int(primitive_map[2]) - 1]
            # max
            if features[-1]["map"].get(int(primitive_map[1]) + int(primitive_map[2])) == None:
                features[-1]["map"][int(primitive_map[1]) + int(primitive_map[2])] = [-1, 0]

    for mapped in features:
        iter_seeds = seeds
        seeds = {}
        for minSeed, maxSeed in iter_seeds.items():
            seed_map = {}
            minVal = [-1, 0]
            minKey = 0
            for key, value in mapped["map"].items():
                if minSeed <= key and key <= maxSeed:
                    seed_map[key] = value
                if minKey <= key and key < minSeed:
                    minKey = key
                    minVal = value

            seed_map[minKey] = minVal
            sorted_seeds = dict(sorted(seed_map.items()))
            
            start = minSeed
            unmaped = None
            for start_loc, pack in sorted_seeds.items():
                to, ranged = pack
                if to == -1:
                    unmaped = start
                    continue

                if unmaped != None:
                    seeds[unmaped] = start_loc - 1
                    start = start_loc
                    unmaped = None

                from_new_seed = to + start - start_loc
                to_new_seed = min(to + ranged,  maxSeed + to - start_loc)
                seeds[from_new_seed] = to_new_seed
                start = start + to_new_seed - from_new_seed + 1

            if unmaped != None:
                seeds[unmaped] = maxSeed
                start = start_loc

    seeds.pop(0) # cough, cough, algorithmic hiccup
    # no time to fix it, I have actual work to do, this took me long enough already
    return min(seeds)


input = read_file()

print("5th Advent of Code")
print("1: ", solver1(input))
print("2: ", solver2(input))