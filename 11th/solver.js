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

function emptry_space(space){
    for(let s of space)
        if (s !== '.')
            return false
    return true
}

function invert_array(array){
    new_array = []
    for(let _ of array[0])
        new_array.push("")

    for(let i in array) {
        for (let j in array[i]) {
            new_array[j] += array[i][j]
        }
    }
    return new_array;

}

function get_dist(pos1, pos2) {
    let x = Math.abs(pos1[0] - pos2[0])
    let y = Math.abs(pos1[1] - pos2[1])
    return x + y
}

function solve1(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');

    let invert_lineArray = invert_array(lineArray);

    let x_spacemap = []

    for (let line of invert_lineArray) {
        if (emptry_space(line)){
            x_spacemap.push(line)
        }
        x_spacemap.push(line)
    }

    x_spacemap = invert_array(x_spacemap)
    let spacemap =[]

    for (let line of x_spacemap) {
        if (emptry_space(line)){
            spacemap.push(line)
        }
        spacemap.push(line)
    }

    let galaxies = []

    for (let i in spacemap) {
        for (let j in spacemap[i]) {
            if (spacemap[i][j] === "#"){
                galaxies.push([i,j])
            }
        }
    }

    let sum = 0
    for (let i in galaxies) {
        for (let j = parseInt(i)+1; j < galaxies.length; j++) {
            sum += get_dist(galaxies[i], galaxies[j])
        }
    }

    return sum

}

function x_times(x, times) {
    let res = [];
    for (let i = 0; i < times; i++) {
        res.push(x);
    }
    return res;
}

function solve2(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');

    let x = x_times(1, lineArray[0].length)
    let y = x_times(1, lineArray.length)

    const invert_lineArray = invert_array(lineArray);

    const scalcer = 1000000

    for (let i = 0; i < invert_lineArray.length; i++) {
        if (emptry_space(invert_lineArray[i])){
            x[i] = scalcer
        }
    }

    for (let i = 0; i < lineArray.length; i++) {
        if (emptry_space(lineArray[i])){
            y[i] = scalcer
        }
    }

    let x_value = []
    let y_value = []

    let tmp = 0
    for (let i = 0; i < x.length; i++) {
        x_value.push(tmp)
        tmp += x[i]
    }

    tmp = 0
    for (let i = 0; i < y.length; i++) {
        y_value.push(tmp)
        tmp += y[i]
    }

    let galaxies = []

    for (let i in lineArray) {
        for (let j in lineArray[i]) {
            if (lineArray[i][j] === "#"){
                galaxies.push([y_value[i], x_value[j]])
            }
        }
    }

    let sum = 0
    for (let i in galaxies) {
        for (let j = parseInt(i)+1; j < galaxies.length; j++) {
            sum += get_dist(galaxies[i], galaxies[j])
        }
    }

    return sum

}



console.log('7th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2());