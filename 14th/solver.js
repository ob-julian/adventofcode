const fs = require('fs');
const os = require('os');
const path = require('path');

function readFileSync(fileName) {
    try {
        const filePath = path.join(__dirname, fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        return content;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

function transpose_matrix(matrix) {
    return transposed = matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function rotate_clock_matrix(matrix) {
    return rotated = transpose_matrix(matrix).map(row => row.reverse());
}

function rotate_counter_clock_matrix(matrix) {
    return rotate_clock_matrix(rotate_clock_matrix(rotate_clock_matrix(matrix)));
}

function solve1(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');
    
    let grid = [];
    let push_nord = [];
    for (let i = 0; i < lineArray.length; i++) {
        grid.push(lineArray[i].split(''));
        push_nord.push(new Array(grid[i].length).fill("."));
    }

    push_nord = transpose_matrix(push_nord);
    grid = transpose_matrix(grid);

    for (let i = 0; i < grid.length; i++) {
        let pos = 0;
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 'O') {
                push_nord[i][pos] = 'O';
                //console.log(push_nord[i][pos]);
                pos++;
            } else if (grid[i][j] === '#') {
                push_nord[i][j] = '#';
                pos = j + 1;
            }
        }
    }

    push_nord = transpose_matrix(push_nord);
    grid = transpose_matrix(grid);

    //console.log(push_nord.join(os.EOL).replace(/,/g, ''));
    
    return get_weight(push_nord);
}

function logMatrix(matrix, direction) {
    matrix = corectDirection(matrix, direction);

    console.log(matrix.join(os.EOL).replace(/,/g, ''), "\n");
}

function corectDirection(matrix, direction) {
    while(direction != 0) {
        matrix = rotate_clock_matrix(matrix);
        direction = (direction + 1) % 4;
    }

    return matrix;
}

function get_weight(matrix) {
    
    let sum = 0;

    for (let i = 0; i < matrix.length; i++) {
        let weight = matrix.length - i;
        let rocks = matrix[i].filter(x => x === 'O').length;
        sum += weight * rocks;
    }

    return sum;
}

function solve2(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');
    
    let grid = [];
    const pushed_master = [];
    for (let i = 0; i < lineArray.length; i++) {
        grid.push(lineArray[i].split(''));
        pushed_master.push(new Array(grid[i].length).fill("."));
    }

    let cylces = 1000000000;

    //logMatrix(grid, 0);
    let cyle_detecton = [];

    grid = rotate_counter_clock_matrix(grid);

    let direction = 3;
    let cyle_detected = false;

    for (let i = 0; i < cylces; i++) {
        if (!cyle_detected && cyle_detecton.includes(grid.join(os.EOL).replace(/,/g, ''))) {
            // calculate remaining cycles
            let ind = cyle_detecton.indexOf(grid.join(os.EOL).replace(/,/g, ''));
            //console.log("cycle detected between: ", ind, " and ", i, "cylces size: ", i - ind);
            let cycle_length = i - ind;
            let cycle_left = cylces - ind - (Math.floor((cylces - ind) / cycle_length))  * cycle_length;
            i = cylces - cycle_left;
            //console.log("cycle ", i);
            cyle_detected = true;
        } else {
            cyle_detecton.push(grid.join(os.EOL).replace(/,/g, ''));
        }
        //console.log(i);
        //logMatrix(grid, direction);
        //console.log("sum: ", get_weight(corectDirection(grid, direction)));

        for (let j = 0; j < 4; j++) {

            pushed = pushed_master.map((arr) => arr.slice());

            for (let i = 0; i < grid.length; i++) {
                let pos = 0;
                for (let j = 0; j < grid[i].length; j++) {
                    if (grid[i][j] === 'O') {
                        pushed[i][pos] = 'O';
                        pos++;
                    } else if (grid[i][j] === '#') {
                        pushed[i][j] = '#';
                        pos = j + 1;
                    }
                }
            }
            direction = (direction + 1) % 4;
            grid = rotate_clock_matrix(pushed);
        }
    }

    grid = corectDirection(grid, direction);
    
    return get_weight(grid);
}


console.log('14th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2());