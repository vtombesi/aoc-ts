import { readData } from '../../shared.ts';
import chalk from 'chalk';

const hashString = (s: string) => {
  const characters = s.split('');
  const result = characters.reduce((acc: number, item: string, index: number) => {
    const asciiCode = item.charCodeAt(0);

    acc += asciiCode;
    acc *= 17;
    acc = acc % 256;

    return acc;
  }, 0);
  return result;
};

export async function day15a(dataPath?: string) {
  const data = await readData(dataPath, false);

  data.split('\n').join('');
  const pieces = data.split(',');

  const result = pieces.reduce((acc: number, item: string, index: number) => {
    const value = hashString(item);
    acc += value;
    return acc;
  }, 0);

  return result;
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
