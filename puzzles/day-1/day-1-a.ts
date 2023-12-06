import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  let total = 0;

  console.log(data, dataPath);

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

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
