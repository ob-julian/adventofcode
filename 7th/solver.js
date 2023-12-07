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

class Cards1 {
    constructor(cards, value) {
        this.cards = cards;
        this.value = value;
        this.position = 0;
        this.hand = new Hand1(cards);
        this.handType = this.hand.getHandType();
        this.handName = Hand.debugHandType(this.handType);
    }

    compareTo(other) {
        if (this.handType === other.handType) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i] !== other.cards[i]) {
                    return Hand.getCardValue1(this.cards[i]) - Hand.getCardValue1(other.cards[i]);
                }
            }
            return 0;
        } else {
            return this.handType - other.handType;
        }
    }
    
}

class Hand {
    static getCardValue1(card) {
        let factor = 10;
        switch (card) {
            case 'A':
                factor += 1;
            case 'K':
                factor += 1;
            case 'Q':
                factor += 1;
            case 'J':
                factor += 1;
            case 'T':
                factor += 1;
                break;
            default:
                factor = parseInt(card);
        }
        return factor;
    }

    
    static debugHandType(num) {
        switch (num) {
            case 1:
                return 'High Card';
            case 2:
                return 'One Pair';
            case 3:
                return 'Two Pairs';
            case 4:
                return 'Three of a Kind';
            case 5:
                return 'Full House';
            case 6:
                return 'Four of a Kind';
            case 7:
                return 'Straight Flush';
            case 8:
                return 'Five of a Kind';
        }
    }

    static getCardValue2(card) {
        let factor = 10;
        switch (card) {
            case 'A':
                factor += 1;
            case 'K':
                factor += 1;
            case 'Q':
                factor += 1;
            case 'T':
                factor += 1;
                break;
            case 'J':
                factor = 1;
                break;
            default:
                factor = parseInt(card);
        }
        return factor;
    }
}

class Hand1 {
    constructor(cards) {
        this.hand = this.getHand(cards);
    }

    getHand(cards) {
        const hand = {}
        for (let i = 2; i <= 15; i++) {
            hand[i] = 0;
        }

        for (let i = 0; i < cards.length; i++) {
            hand[Hand.getCardValue1(cards[i])]++;
        }
        return hand;
    }


    getHandType() {
        const strip = [];
        for (let i = 2; i <= 15; i++) {
            if (this.hand[i] > 0) {
                strip.push(this.hand[i]);
            }
        }

        strip.sort((a, b) => b - a); // reminder: sort order is high to low

        if (strip.length === 5) {
            // is high card (1)
            return 1;
        } else if (strip.length === 4) {
            // is one pair (2)
            return 2;
        } else if (strip.length === 3) {
            // is two pairs (3) or three of a kind (4)
            return strip[0] === 3 ? 4 : 3;
        } else if (strip.length === 2) {
            // is full house (5) or four of a kind (7)
            return strip[0] === 3 ? 5 : 7;
        } else if (strip.length === 1) {
            // is five of a kind (8)
            return 8;
        }
    }

}

function solve1(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');
    
    const hands = [];
    for (let i = 0; i < lineArray.length; i++) {
        const cards = lineArray[i].split(' ');
        hands.push(new Cards1(cards[0], cards[1]));
        //console.log(Hand.debugHandType(hands[i].handType), hands[i].cards);
    }

    hands.sort((a, b) => a.compareTo(b));

    let total = 0;
    for (let i = 0; i < hands.length; i++) {
        hands[i].position = i + 1;
        total += hands[i].value * (i + 1);
    };

    return total;
}



class Cards2 {
    constructor(cards, value) {
        this.cards = cards;
        this.value = value;
        this.position = 0;
        this.hand = new Hand2(cards);
        this.handType = this.hand.getHandType();
        this.handName = Hand.debugHandType(this.handType);
    }

    compareTo(other) {
        if (this.handType === other.handType) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i] !== other.cards[i]) {
                    return Hand.getCardValue2(this.cards[i]) - Hand.getCardValue2(other.cards[i]);
                }
            }
            return 0;
        } else {
            return this.handType - other.handType;
        }
    }
    
}

class Hand2 {
    constructor(cards) {
        this.hand = this.getHand(cards);
    }

    getHand(cards) {
        const hand = {}
        for (let i = 1; i <= 14; i++) {
            hand[i] = 0;
        }

        for (let i = 0; i < cards.length; i++) {
            hand[Hand.getCardValue2(cards[i])]++;
        }
        return hand;
    }

    getHandType() {
        const strip = [];
        for (let i = 2; i <= 15; i++) {
            if (this.hand[i] > 0) {
                strip.push(this.hand[i]);
            }
        }

        let jokers = this.hand[1];

        strip.sort((a, b) => b - a); // reminder: sort order is high to low
        
        strip[0] += jokers;

        if (strip.length === 5) {
            // is high card (1)
            return 1;
        } else if (strip.length === 4) {
            // is one pair (2)
            return 2;
        } else if (strip.length === 3) {
            // is two pairs (3) or three of a kind (4)
            return strip[0] === 3 ? 4 : 3;
        } else if (strip.length === 2) {
            // is full house (5) or four of a kind (7)
            return strip[0] === 3 ? 5 : 7;
        } else if (strip.length === 1) {
            // is five of a kind (8)
            return 8;
        }
    }

}

function solve2(filePath = 'input.txt') {
    const fileContent = readFileSync(filePath);
    const lineArray = fileContent.split('\r\n');
    
    const hands = [];
    for (let i = 0; i < lineArray.length; i++) {
        const cards = lineArray[i].split(' ');
        hands.push(new Cards2(cards[0], cards[1]));
        //console.log(Hand.debugHandType(hands[i].handType), hands[i].cards);
    }

    hands.sort((a, b) => a.compareTo(b));

    let total = 0;
    for (let i = 0; i < hands.length; i++) {
        hands[i].position = i + 1;
        total += hands[i].value * (i + 1);
    };

    return total;
}


console.log('7th  Advent of Code');
console.log('1: ', solve1());
console.log('2: ', solve2());