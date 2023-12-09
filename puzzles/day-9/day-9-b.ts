import { readData } from '../../shared.ts';
import chalk from 'chalk';

function extrapolate(arr: string | any[]) {
  const difference = [];
  if (arr.length === 0) {
    return 0;
  }
  for (let i = 1; i < arr.length; i++) {
    i = parseInt(i.toString());
    difference.push(arr[i] - arr[i - 1]);
  }

  return arr[0] - extrapolate(difference);
}

export async function day9b(dataPath?: string) {
  const data = await readData(dataPath, false);
  const lines = data.split('\n').map((line: string) => {
    return line.split(' ').map((n: string) => {
      return parseInt(n);
    });
  });
  const post = lines.map((line: any) => {
    return extrapolate(line);
  });
  return post.reduce((acc: any, n: number) => {
    if (isNaN(n)) {
      return acc;
    }
    return acc + n;
  }, 0);
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
