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
    //const filePath = 'input.txt';
    //const filePath = 'testData.txt';
    const fileContent = readFileSync(filePath);
    const fileArray = fileContent.split('\r\n');

    let points = 0;
    for(let i in fileArray) {
        const cardSplit = fileArray[i].split(': ');
        const id = cardSplit[0].split(" ")[-1]
        const splitNumbers = cardSplit[1].split(" | ");
        const winningNumbers = getNumbers(splitNumbers[0]);
        const yourNumbers = getNumbers(splitNumbers[1]);

        
        let cardPoints = 1/2;
        yourNumbers.forEach((num) => {
            if(winningNumbers.includes(num))
            cardPoints *= 2;
        })

        if(cardPoints != 1/2){
            points += cardPoints;
            cardPoints = 1/2;
        }
    }
    return points;
}

function getNumbers(input){
    let tmp = "";
    let numbers = [];
    for (let i in input)
        if (i % 3 == 2) {
            numbers.push(parseInt(tmp))
            tmp = ""
        } else {
            if (input[i] != " ") {
                tmp += input[i]
            }
        }
    numbers.push(parseInt(tmp))
    return numbers
}

function solve2(filePath = 'input.txt') {
    //const filePath = 'input.txt';
    //const filePath = 'testData.txt';
    const fileContent = readFileSync(filePath);
    const fileArray = fileContent.split('\r\n');
    const cardArray = new Array(fileArray.length);

    for(let i in fileArray) {
        const cardSplit = fileArray[i].split(': ');
        const splitNumbers = cardSplit[1].split(" | ");
        const winningNumbers = getNumbers(splitNumbers[0]);
        const yourNumbers = getNumbers(splitNumbers[1]);

        
        let cardPoints = 0;
        yourNumbers.forEach((num) => {
            if(winningNumbers.includes(num))
            cardPoints += 1;
        })

        cardArray[i] = ({
            total: 1,
            score: cardPoints
        })
    }
    // wrok
    let total = 0;
    for(let i = 0; i < cardArray.length; i++) {
        total += cardArray[i].total;
        for (let j = 1; j <= cardArray[i].score ; j++) {
            if(cardArray[i+j] !== undefined) {
                cardArray[i+j].total += cardArray[i].total; 
            }      
        }
    }

    return total;
}


console.log('4th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2());