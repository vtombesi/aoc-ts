import { readData } from '../../shared.ts';
import chalk from 'chalk';

/**
 * Performs transformations on textual representations of numbers and calculates the sum of modified numbers.
 *
 * @param dataPath - Path to the data to be processed (optional).
 * @returns The total sum of numbers obtained after transformations.
 */
export async function day1b(dataPath?: string): Promise<number> {
  let data = await readData(dataPath);

  let total = 0;

  const numbersAsLetters = [
    { orig: 'one', change: 'on1e' },
    { orig: 'two', change: 't2wo' },
    { orig: 'three', change: 't3hree' },
    { orig: 'four', change: 'fo4ur' },
    { orig: 'five', change: 'fi5ve' },
    { orig: 'six', change: 'si6x' },
    { orig: 'seven', change: 'seve7n' },
    { orig: 'eight', change: 'eig8ht' },
    { orig: 'nine', change: 'nin9e' },
  ];

  data.forEach((item: string | string[], index: string | number) => {
    numbersAsLetters.map((number) => {
      if (item.indexOf(number.orig) > -1) {
        const { orig, change } = number;
        data[index] = data[index].split(orig).join(change);
      }
    });
  });

  const finalNumber: number = data.reduce(
    (acc: any, item: string, index: number) => {
      const numbers = Number(item.replace(/\D+/g, ''));
      const singleNumbers = String(numbers).split('');
      const first = singleNumbers[0];
      const last = singleNumbers[singleNumbers.length - 1];
      const finalNumber = parseInt(`${first}${last}`, 10);
      total += finalNumber;
    },
    0
  );

  return total;
}

/**
 * Executes the algorithm for day 1 (part B) and displays the result.
 */
async function executeDay1b() {
  const answer = await day1b();
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}

executeDay1b(); // Run the algorithm
