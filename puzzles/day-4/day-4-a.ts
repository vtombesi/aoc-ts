import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath, false);

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

  // count all the winning numbers on each card and add them up (add using 2^(count-1))
  return cards.reduce((sum, card) => {
    let count = card.numbers.filter((num) => card.winning.includes(num)).length;
    if (count > 0) sum += Math.pow(2, count - 1);
    return sum;
  }, 0);
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
