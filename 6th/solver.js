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

function getNumbers(input){
    let tmp = "";
    let numbers = [];
    for (let i in input) {
        if (input[i] != " ") {
            if (input[i] != " ") {
                tmp += input[i]
            }
        } else if (tmp != "") {
            numbers.push(parseInt(tmp))
            tmp = ""
        }
    }
    numbers.push(parseInt(tmp))
    return numbers
}

function solve1(filePath = 'input.txt') {
    //const filePath = 'input.txt';
    //const filePath = 'testData.txt';
    const fileContent = readFileSync(filePath);
    const fileArray = fileContent.split('\r\n');

    const timeString = fileArray[0].split(': ')[1];
    const distanceString = fileArray[1].split(': ')[1];
    const timeArray = getNumbers(timeString);
    const distanceArray = getNumbers(distanceString);

    total = 1;
    for (let i in timeArray) {
        const time = timeArray[i];
        const distance = distanceArray[i];
        let attempt = 0;
        for (let j = 1; j < time; j++) {
            if ( (j * (time - j)) > distance ){
                attempt++;
            }
        }
        total *= attempt;

    }

    return total;
}

function getOneNumbers(input){
    let tmp = "";
    for (let i in input) {
        if (input[i] != " ") {
            if (input[i] != " ") {
                tmp += input[i]
            }
        }
    }
    return parseInt(tmp)
}


function solve2(filePath = 'input.txt') {
    //const filePath = 'input.txt';
    //const filePath = 'testData.txt';
    const fileContent = readFileSync(filePath);
    const fileArray = fileContent.split('\r\n');

    const timeString = fileArray[0].split(': ')[1];
    const distanceString = fileArray[1].split(': ')[1];
    const time = getOneNumbers(timeString);
    const distance = getOneNumbers(distanceString);

    let attempt = 0;
    for (let j = 1; j < time; j++) {
        if ( (j * (time - j)) > distance ){
            attempt++;
        }
    }

    return attempt;
}


console.log('6th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2());