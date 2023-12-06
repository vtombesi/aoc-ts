import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day18b(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}

const answer = await day18b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
