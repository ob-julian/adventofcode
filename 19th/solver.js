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
    
    let is_rules = true;
    let rules = {};
    let sum = 0;
    for (let i of lineArray) {
        if (i.trim() === '') {
            is_rules = false;
            continue;
        }

        if (is_rules) {
            let name = i.split('{')[0].trim();
            let bareRule = i.split('{')[1].replace('}', '').trim();

            let ruleParts = bareRule.split(',');

            let localRules = []

            for (let j of ruleParts) {
                if (j.split(':').length === 1)
                    localRules.push([j]);
                else {
                    let ruleParts1 = j.substring(0, 1);
                    let ruleParts2 = j.substring(1, 2);
                    let ruleParts3 = j.substring(2, j.length).split(':')[0];
                    let ruleParts4 = j.substring(2, j.length).split(':')[1];
                    localRules.push([ruleParts1, ruleParts2, ruleParts3, ruleParts4]);
                }
            }
            rules[name] = localRules;

        } else {
            let primitivePart = i.replaceAll(/[{})]/g, '').split(',');
            let part = {};
            for (let j = 0; j < primitivePart.length; j++) {
                let part1 = primitivePart[j].split('=')[0];
                let part2 = primitivePart[j].split('=')[1];
                part[part1] = parseInt(part2);
            }

            line = "in"
            while (line !== "R" && line !== "A") {
                line = executeRule(rules[line], part);
            }
            if (line === "A") {
                for (let j in part) {
                    sum += part[j];
                }
            }
        }
    }

    return sum;
}

function executeRule(rule, input) {
    for (let rulePart of rule) {
        if (rulePart.length === 1) {
            return rulePart[0];
        }
        switch (rulePart[1]) {
            case '<':
                if (input[rulePart[0]] < parseInt(rulePart[2])) {
                    return rulePart[3];
                }
                break;
            case '>':
                if (input[rulePart[0]] > parseInt(rulePart[2])) {
                    return rulePart[3];
                }
                break;
        }
    }
}

function solve2(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');
    
    let rules = {};
    for (let i of lineArray) {
        if (i.trim() === '') {
            break;
        }
        let name = i.split('{')[0].trim();
        let bareRule = i.split('{')[1].replace('}', '').trim();

        let ruleParts = bareRule.split(',');

        let localRules = []

        for (let j of ruleParts) {
            if (j.split(':').length === 1)
                localRules.push([j]);
            else {
                let ruleParts1 = j.substring(0, 1);
                let ruleParts2 = j.substring(1, 2);
                let ruleParts3 = j.substring(2, j.length).split(':')[0];
                let ruleParts4 = j.substring(2, j.length).split(':')[1];
                localRules.push([ruleParts1, ruleParts2, ruleParts3, ruleParts4]);
            }
        }
        rules[name] = localRules;
    }

    let queue = [];

    let acceped = [];
    let rejected = [];

    queue.push(["in", {x  : {min: 1, max: 4000}, m: {min: 1, max: 4000}, a: {min: 1, max: 4000}, s: {min: 1, max: 4000}}]);
    while (queue.length > 0) {
        let input = queue.shift();
        if (input[0] === "R") {
            rejected.push(input[1]);
            continue;
        } else if (input[0] === "A") {
            acceped.push(input[1]);
            continue;   
        }
        let line = input[0];
        let rule = rules[line];
        let part = input[1];

        for (let rulePart of rule) {
            if (rulePart.length === 1) {
                queue.push([rulePart[0], Object.assign({}, part)]);
            } else {
                switch (rulePart[1]) {
                    case '<':
                        if (part[rulePart[0]].min < parseInt(rulePart[2])) {
                            if (part[rulePart[0]].max < parseInt(rulePart[2])) {
                                queue.push([rulePart[3], Object.assign({}, part)]);
                            } else {
                                let newPart = JSON.parse(JSON.stringify(part));
                                newPart[rulePart[0]].max = parseInt(rulePart[2]) - 1;
                                queue.push([rulePart[3], newPart]);
                                part[rulePart[0]].min = parseInt(rulePart[2]);
                            }
                        }
                        break;
                    case '>':
                        if (part[rulePart[0]].max > parseInt(rulePart[2])) {
                            if (part[rulePart[0]].min > parseInt(rulePart[2])) {
                                queue.push([rulePart[3], Object.assign({}, part)]);
                            } else {
                                let newPart = JSON.parse(JSON.stringify(part));
                                newPart[rulePart[0]].min = parseInt(rulePart[2]) + 1;
                                queue.push([rulePart[3], newPart]);
                                part[rulePart[0]].max = parseInt(rulePart[2]);
                            }
                        }
                        break;
                }
            }
        }
    }

    let sum = 0;

    for (let rej of rejected) {
        let accum =  1;
        for (let j in rej) {
            accum *= rej[j].max - rej[j].min + 1;
        }
        sum += accum;
    }
    return 4000*4000*4000*4000 - sum;
}

console.log('19th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2());