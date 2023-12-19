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

function solve1(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');

    ground = [['#']];
    x = 0;
    y = 0;

    for (let i of lineArray) {
        let parts = i.split(' ');
        let direction = parts[0];
        let amount = parseInt(parts[1]);
        //console.log(direction, amount);

        for (let j = 0; j < amount; j++) {
            switch (direction) {
                case 'R':
                    y++;
                    break;
                case 'L':
                    y--;
                    break;
                case 'U':
                    x--;
                    break;
                case 'D':
                    x++;
                    break;
            }

            if (x < 0) {
                ground.unshift(Array(ground[0].length).fill('.'));
                x = 0;
            } else if (x >= ground.length) {
                ground.push(Array(ground[0].length).fill('.'));
            }
            if (y < 0) {
                for (let k = 0; k < ground.length; k++) {
                    ground[k].unshift('.');
                }
                y = 0;
            } else if (y >= ground[0].length) {
                for (let k = 0; k < ground.length; k++) {
                    ground[k].push('.');
                }
            }

            // assert x, y is in bounds
            ground[x][y] = '#'
        }
    }
    //console.log(ground.join(os.EOL).replace(/,/g, ''));

    ground.unshift(Array(ground[0].length).fill('.'));
    ground.push(Array(ground[0].length).fill('.'));
    for (let k = 0; k < ground.length; k++) {
        ground[k].unshift('.');
        ground[k].push('.');
    }

    let queue = [];
    queue.push([0, 0]);

    while(queue.length > 0) {
        let [x, y] = queue.shift();
        if (ground[x][y] != '.') {
            continue;
        }
        ground[x][y] = 'O';

        let candidates = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];

        for (let c of candidates) {
            if (c[0] >= 0 && c[0] < ground.length && c[1] >= 0 && c[1] < ground[0].length && ground[c[0]][c[1]] == '.') {
                queue.push(c);
            }
        }
    }

    //console.log(ground.join(os.EOL).replace(/,/g, ''));

    lava = 0;

    for (let i of ground) {
        for (let j of i) {
            if (j != 'O') {
                lava++;
            }
        }
    }

    return lava;
}

function add_in_y(ground, y) {
    for (let k = 0; k < ground.length; k++) {
        ground[k].splice(y, 0, ground[k][y]);
    }
}

function add_in_x(ground, x) {
    ground.splice(x, 0, ground[x]);
}

function solve2(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');

    ground = [['#']];
    x = 0;
    y = 0;
    steps_x = [1];
    steps_y = [1];

    for (let i of lineArray) {
        let parts = i.split(' ');
        let part2 = parts[2];
        let direction = parseInt(part2.substring(7, 8));
        let amount = parseInt(part2.substring(2, 7), 16);

        switch (direction) {
            case 0: // right
                y++;
                break;
            case 2: // left
                y--;
                break;
            case 3: // up
                x--;
                break;
            case 1: // down
                x++;
                break;
        }

        if (x < 0) {
            ground.unshift(Array(ground[0].length).fill('.'));
            steps_x.unshift(0);
            x = 0;
            ground[x][y] = '#'
            steps_x[x] = amount;
        } else if (x >= ground.length) {
            ground.push(Array(ground[0].length).fill('.'));
            steps_x.push(0);
            ground[x][y] = '#'
            steps_x[x] = amount;
        } else if (y < 0) {
            for (let k = 0; k < ground.length; k++) {
                ground[k].unshift('.');
            }
            y = 0;
            ground[x][y] = '#'
            steps_y[y] = amount;
        } else if (y >= ground[0].length) {
            for (let k = 0; k < ground.length; k++) {
                ground[k].push('.');
            }
            ground[x][y] = '#'
            steps_y[y] = amount;
        } else {
            if (direction == 0) {
                // right
                while (amount > 0) {
                    ground[x][y] = '#'
                    if (steps_y[y] > amount) {
                        steps_y[y] -= amount;
                        steps_y.splice(y, 0, amount);
                        add_in_y(ground, y);
                        amount = 0;
                    } else {
                        amount -= steps_y[y];
                        y++;
                    }
                }
            } else if (direction == 2) {
                // left
                while (amount > 0) {
                    ground[x][y] = '#'
                    if (steps_y[y] > amount) {
                        steps_y.splice(y, 0, steps_y[y] - amount);
                        steps_y[y+1] = amount;
                        add_in_y(ground, y);
                        amount = 0;
                    } else {
                        amount -= steps_y[y];
                        y--;
                    }
                }
            } else if (direction == 3) {
                // up
                while (amount > 0) {
                    ground[x][y] = '#'
                    if (steps_x[x] > amount) {
                        steps_x.splice(x, 0, steps_x[x] - amount);
                        steps_x[x+1] = amount;
                        add_in_x(ground, x);
                        amount = 0;
                    } else {
                        amount -= steps_x[x];
                        x--;
                    }
                }
            } else if (direction == 1) {
                // down
                while (amount > 0) {
                    ground[x][y] = '#'
                    if (steps_x[x] > amount) {
                        steps_x.splice(x, 0, amount);
                        add_in_x(ground, x);
                        amount = 0;
                    } else {
                        amount -= steps_x[x];
                        x++;
                    }
                }
            }

        }
        
        console.log(steps_y);
        console.log(steps_x);
        console.log(ground.join(os.EOL).replace(/,/g, ''));
        console.log();
    }
    console.log(ground.join(os.EOL).replace(/,/g, ''));

    ground.unshift(Array(ground[0].length).fill('.'));
    ground.push(Array(ground[0].length).fill('.'));
    for (let k = 0; k < ground.length; k++) {
        ground[k].unshift('.');
        ground[k].push('.');
    }
    steps_x.unshift(0);
    steps_x.push(0);
    steps_y.unshift(0);
    steps_y.push(0);

    let queue = [];
    queue.push([0, 0]);

    while(queue.length > 0) {
        let [x, y] = queue.shift();
        if (ground[x][y] != '.') {
            continue;
        }
        ground[x][y] = 'O';

        let candidates = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];

        for (let c of candidates) {
            if (c[0] >= 0 && c[0] < ground.length && c[1] >= 0 && c[1] < ground[0].length && ground[c[0]][c[1]] == '.') {
                queue.push(c);
            }
        }
    }

    //console.log(ground.join(os.EOL).replace(/,/g, ''));

    lava = 0;

    for (let i = 0; i < ground.length; i++) {
        for (let j = 0; j < ground[0].length; j++) {
            if (ground[i][j] != 'O') {
                lava += steps_x[i] + steps_y[j];
            }
        }
    }

    return lava;
}


console.log('18th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2("testData.txt"));