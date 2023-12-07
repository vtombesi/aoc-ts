import { readData } from '../../shared.ts';
import chalk from 'chalk';

const part1CardValues = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

function compareHands(a, b, cardValues) {
  if (a.strength > b.strength) {
    return 1;
  } else if (a.strength < b.strength) {
    return -1;
  } else {
    for (let i = 0; i < a.hand.length; i++) {
      if (cardValues[a.hand[i]] > cardValues[b.hand[i]]) {
        return 1;
      } else if (cardValues[a.hand[i]] < cardValues[b.hand[i]]) {
        return -1;
      }
    }

    return 0;
  }
}

const calculateOrdinaryHandStrength = (hand) => {
  let cardCounts = {};
  let handStrength = 1;
  let matchProperties = {
    onePair: false,
    twoPair: false,
    threeOfAKind: false,
    fullHouse: false,
    fourOfAKind: false,
    fiveOfAKind: false,
    jokerCount: 0,
  };

  for (let i = 0; i < hand.length; i++) {
    let card = hand[i];
    if (cardCounts[card]) {
      cardCounts[card]++;
    } else {
      cardCounts[card] = 1;
    }
  }

  let keys = Object.keys(cardCounts);
  for (let i = 0; i < keys.length; i++) {
    let count = cardCounts[keys[i]];
    if (count == 2) {
      if (matchProperties.onePair) {
        handStrength = 3;
        matchProperties.twoPair = true;
      } else if (matchProperties.threeOfAKind) {
        handStrength = 5;
        matchProperties.onePair = true;
        matchProperties.fullHouse = true;
      } else {
        handStrength = 2;
        matchProperties.onePair = true;
      }
    } else if (count == 3) {
      if (matchProperties.onePair) {
        handStrength = 5;
        matchProperties.fullHouse = true;
        matchProperties.threeOfAKind = true;
      } else {
        handStrength = 4;
        matchProperties.threeOfAKind = true;
      }
    } else if (count == 4) {
      handStrength = 6;
      matchProperties.fourOfAKind = true;
    } else if (count == 5) {
      handStrength = 7;
      matchProperties.fiveOfAKind = true;
    }
  }

  return { handStrength, matchProperties };
};

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  console.log(data);

  let players = data.map((line) => {
    let rawData = line.split(' ');
    return {
      hand: rawData[0],
      bid: Number(rawData[1]),
      strength: determinePart1HandStrength(rawData[0]),
    };
  });

  players.sort((a, b) => {
    return compareHands(a, b, part1CardValues);
  });

  // console.log(players);
  let result = players.reduce(
    (acc: string, cur: { bid: string }, i: number) => {
      return parseInt(acc) + parseInt(cur.bid) * (i + 1);
    },
    0
  );

  return result;
}

function determinePart1HandStrength(hand) {
  return calculateOrdinaryHandStrength(hand).handStrength;
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
