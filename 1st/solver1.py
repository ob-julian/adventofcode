import os;

def read_file(file_name = 'input.txt'):
    current_directory = os.path.dirname(__file__)
    file_path = os.path.join(current_directory, file_name)

    with open(file_path, 'r') as file:
        content =  [line.strip() for line in file.readlines()]
        
    return content

def solver1 (input):
    num = 0
    for i in range(len(input)):
        a = getNumber(input[i])
        b = getNumber(input[i][::-1])
        num += 10*a + b

    return num

def solver2 (input):
    num = 0
    for i in range(len(input)):
        a = firstNumToNum(input[i])
        b = lastNumToNum(input[i])
        num += 10*a + b

    return num

def getNumber(input):
    for i in range(len(input)):
        if input[i] >= '0' and input[i] <= '9':
            return int(input[i])

def firstNumToNum(input):
    for i in range(len(input)):
        if input[i] >= '0' and input[i] <= '9':
            return int(input[i])
        else:
            inp = input[:i+1]
            inp = inp.replace("one", "1").replace("two", "2").replace("three", "3").replace("four", "4").replace("five", "5").replace("six", "6").replace("seven", "7").replace("eight", "8").replace("nine", "9")
            if inp != input[:i+1]:
                return int(inp[-1])
    
def lastNumToNum(input):
    for i in range(1, len(input)+1):
        if input[-i] >= '0' and input[-i] <= '9':
            return int(input[-i])
        else:
            inp = input[-i:]
            inp = inp.replace("one", "1").replace("two", "2").replace("three", "3").replace("four", "4").replace("five", "5").replace("six", "6").replace("seven", "7").replace("eight", "8").replace("nine", "9")
            if inp != input[-i:]:
                return int(inp[0])


input = read_file()

print("1st Advent of Code")
print("1: ", solver1(input))
print("2: ", solver2(input))