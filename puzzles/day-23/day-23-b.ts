import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day23b(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}

const answer = await day23b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
