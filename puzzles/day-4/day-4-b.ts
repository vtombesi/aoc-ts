import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath, false);
  /**
   * parses input to return a list of cards with winning numbers and numbers drawn
   *
   * @type {Card[]}
   */
  const cards = data.split(/\n/g).map((line) => {
    let [winning, numbers] = line
      .split(/: /)[1]
      .split(/ \| /)
      .map((numbers) =>
        numbers
          .split(/ /)
          .filter((number) => number != '')
          .map((num) => parseInt(num))
      );
    return { winning, numbers };
  });

  // use memoization to run the recursive function faster (skips cards already counted)
  let memoization = [];

  /**
   * returns the number of scratch cards that the card generates
   *
   * @param {Card} card the card being counted
   * @param {number} index index of card beign counted
   * @returns {number}
   */
  let countScratchCards = (card, index) => {
    if (memoization[index] != null) return memoization[index];

    let cardCount = 1;
    let wins = card.numbers.filter((num) => card.winning.includes(num)).length;

    if (wins > 0) {
      for (let i = 0; i < wins; i++) {
        let nextIndex = index + i + 1;
        cardCount += countScratchCards(cards[nextIndex], nextIndex);
      }
    }

    memoization[index] = cardCount;
    return cardCount;
  };

  // count all cards
  return cards.reduce((sum, card, index) => {
    return sum + countScratchCards(card, index);
  }, 0);
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
