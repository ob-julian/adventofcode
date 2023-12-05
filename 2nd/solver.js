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

function getGameArray(filePath = 'input.txt') {
    //const filePath = 'input.txt';
    //const filePath = 'testData.txt';
    const fileContent = readFileSync(filePath);
    const fileArray = fileContent.split('\r\n');
    const gameArray = new Array(fileArray.length)
    for (let i in fileArray) {
        const partial = fileArray[i].split(': ');
        const id = parseInt(partial[0].split(' ')[1]);
        const gamesBundeled = partial[1].split('; ');
        const games = new Array(); 
        gamesBundeled.forEach((g) => {
            const split = g.split(', ');
            const game = new Object;
            split.forEach((splitter) => {
                const atom = splitter.split(' ');
                switch (atom[1]) {
                    case 'red':
                        game.red = parseInt(atom[0]);
                        break;
                    case 'green':
                        game.green = parseInt(atom[0]);
                        break;
                    case 'blue':
                        game.blue = parseInt(atom[0]);
                        break;
                }
            });
            games.push(game);
        })

        gameArray.push({
            id: id,
            games: games
        })
    }

    return gameArray;
}

function solve1(gameArray) {
    const max_red = 12;
    const max_green = 13;
    const max_blue = 14;

    let cumm = 0;
    let ackk = 0;

    for (let i in gameArray) {
        const id = gameArray[i].id;
        ackk += id;
        const games = gameArray[i].games;
        for (let game of games) {
            if (game.red > max_red) {
                cumm += id;
                break;
            }
            else if (game.green > max_green) {
                cumm += id;
                break;
            }
            else if (game.blue > max_blue) {
                cumm += id;
                break;
            }
        }
    }
    return ackk - cumm;
}

function solve2(gameArray) {
    let solution = 0;

    for (let i in gameArray) {
        let min_red = 0;
        let min_green = 0;
        let min_blue = 0;

        const id = gameArray[i].id;
        const games = gameArray[i].games;
        for (let game of games) {

            if (game.red > min_red) {
                min_red = game.red;
            }
            if (game.green > min_green) {
                min_green = game.green;
            }
            if (game.blue > min_blue) {
                min_blue = game.blue;
            }
        }
        solution += min_red * min_green * min_blue;
    }
    return solution;
}

const gameArray = getGameArray();

console.log('2nd  Advent of Code');
console.log('1: ', solve1(gameArray));
console.log('2: ', solve2(gameArray));