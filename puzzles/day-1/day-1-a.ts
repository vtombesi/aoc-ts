import { readData } from '../../shared.ts';
import chalk from 'chalk';

/**
 * Calculates the sum of numbers obtained from digit operations.
 *
 * @param dataPath - Path to the data to be processed (optional).
 * @returns The total sum of numbers obtained from digit operations.
 */
export async function day1a(dataPath?: string): Promise<number> {
  const data = await readData(dataPath);

  let total = 0;

  data.forEach((item: string) => {
    const numbers = Number(item.replace(/\D+/g, ''));
    const singleNumbers = String(numbers).split('');
    const first = singleNumbers[0];
    const last = singleNumbers[singleNumbers.length - 1];
    const finalNumber = parseInt(`${first}${last}`, 10);
    total += finalNumber;
  });

  return total;
}

/**
 * Executes the algorithm for day 1 (part A) and displays the result.
 */
async function executeDay1a() {
  const answer = await day1a();
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}

executeDay1a(); // Run the algorithm
