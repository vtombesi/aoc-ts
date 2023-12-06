import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day7b(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
