import { readData } from '../../shared.ts';
import chalk from 'chalk';

/**
 * Represents the configuration of game colors.
 */
const gameConfiguration: any = {
  red: 12,
  green: 13,
  blue: 14,
};

/**
 * Validates and processes game data to determine an accumulated result.
 *
 * @param dataPath - Path to the data to be processed (optional).
 * @returns The accumulated result based on the processed game data.
 */
export async function day2a(dataPath?: string): Promise<number> {
  const data = await readData(dataPath);

  const result = data.reduce((acc: any, item: string, index: number) => {
    let matches = item.match(/Game (\d+):/);

    let id = parseInt(matches[1]);
    let contentString = item.replace(/^Game \d+: /gm, '');

    let subMatches = contentString.split('; ');

    let valid = true;

    subMatches.forEach((configuration) => {
      const parts = configuration.split(', ');
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

/**
 * Executes the algorithm for day 2 (part A) and displays the result.
 */
async function executeDay2a() {
  const answer = await day2a();
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}

executeDay2a(); // Run the algorithm
