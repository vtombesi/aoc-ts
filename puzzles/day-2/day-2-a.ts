import { readData } from '../../shared.ts';
import chalk from 'chalk';

const gameConfiguration: any = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);

  const result = data.reduce((acc: any, item: string, index: number) => {
    let matches = item.match(/Game (\d+):/);

    let id = parseInt(matches[1]);
    let contentString = item.replace(/^Game \d+: /gm, '');

    let subMatches = contentString.split('; ');

    let valid = true;

    subMatches.forEach((configuration) => {
      const parts = configuration.split(', ');
      console.log('parts: ', parts);
      parts.forEach((part) => {
        if (part.indexOf('red')) {
          const red = part.replace(' red', '');
          if (red > gameConfiguration.red) {
            valid = false;
          }
        }
        if (part.indexOf('green')) {
          const green = part.replace(' green', '');
          if (green > gameConfiguration.green) {
            valid = false;
          }
        }
        if (part.indexOf('blue')) {
          const blue = part.replace(' blue', '');
          if (blue > gameConfiguration.blue) {
            valid = false;
          }
        }
      });
    });

    if (valid) {
      acc += id;
    }

    return acc;
  }, 0);

  return result;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
