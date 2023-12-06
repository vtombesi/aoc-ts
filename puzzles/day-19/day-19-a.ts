import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day19a(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}

const answer = await day19a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
