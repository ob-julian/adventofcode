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

class FlipFlop {
    constructor(output) {
        this.state = [0];
        this.output = output;
    }

    getSignal(module, state) {
        if (state === 0) {
            this.state[0] = (this.state[0] + 1) % 2;
            return this.output.map(element => [element, this.state[0]]);
        }
    }
}

class Conjunction {
    constructor(output) {
        this.state = [];
        this.input = [];
        this.output = output;
    }

    getSignal(module, state) {
        this.state[this.input.indexOf(module)] = state;
        if (this.state.includes(0)) {
            return this.output.map(element => [element, 1]);
        }
        return  this.output.map(element => [element, 0]);
    }

    setInputs(inputs) {
        this.input = inputs;
        this.state = new Array(inputs.length).fill(0);
    }

}

class Broadcaster {
    constructor(output) {
        this.output = output;
        this.state = [0];
    }

    getSignal(module, state) {
        return this.output.map(element => [element, state]);
    }
}

function solve1(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');

    let modules = {};
    let cleanup = [];
    for (let i of lineArray) {
        if (i[0] === '%') {
            let parts = i.substring(1).split(' -> ');
            let name = parts[0];
            let output = parts[1].split(',').map(element => element.trim());
            modules[name] = new FlipFlop(output);
        } else if (i[0] === '&') {
            let parts = i.substring(1).split(' -> ');
            let name = parts[0];
            let output = parts[1].split(',').map(element => element.trim());
            modules[name] = new Conjunction(output);
            cleanup.push(name);
        } else if (i.startsWith('broadcaster')) {
            let parts = i.split(' -> ');
            let name = parts[0];
            let output = parts[1].split(',').map(element => element.trim());
            modules[name] = new Broadcaster(output);
        }
    }

    for (let i of cleanup) {
        let inputs = [];
        for (let j in modules) {
            if (modules[j].output.includes(i)) {
                inputs.push(j[0]);
            }
        }
        modules[i].setInputs(inputs);
    }

    //console.log(modules);

    let times = 1000;
    let stateCount = new Array(2).fill(0);
    let i = 0;
    while (i < times) {
        let queue = [];
        queue.push(['broadcaster', 'button', 0]);
        while (queue.length > 0) {
            let [module, lastModule, state] = queue.shift();
            //console.log(lastModule, state, module);
            stateCount[state]++;
            if (modules[module] === undefined) {
                continue;
            }
            let output = modules[module].getSignal(lastModule, state);
            if (output !== undefined) {
                output.forEach(element => {
                    queue.push([element[0], module, element[1]]);
                });
            }
        }
        //console.log(modules);
        let circle = true;
        for (let i in modules) {
            if (modules[i].state.includes(1)) {
                circle = false;
                break;
            }
        }
        if (circle) {
            console.log('Circle at', i);
            rest = times % (i + 1);
            skipped = (times - rest) / (i + 1);
            i = times - rest;
            stateCount = stateCount.map(element => element * skipped);
        } else {
            i++;
        }
    }
    
    //console.log(stateCount);
    return stateCount[0] * stateCount[1];
}

function solve2(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');
    
}

console.log('20th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2("testData2.txt"));