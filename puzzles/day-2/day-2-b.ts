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
 * Processes game data, calculates a power value based on color configurations, and accumulates the result.
 *
 * @param dataPath - Path to the data to be processed (optional).
 * @returns The accumulated power value based on the processed game data.
 */
export async function day2b(dataPath?: string): Promise<number> {
  const data = await readData(dataPath);

  const result = data.reduce((acc: any, item: string, index: number) => {
    let matches = item.match(/Game (\d+):/);

    let contentString = item.replace(/^Game \d+: /gm, '');

    let subMatches = contentString.split('; ');

    let valid = true;

    const itemBoxes: any = {
      red: 0,
      blue: 0,
      green: 0,
    };

    subMatches.forEach((configuration) => {
      const parts = configuration.split(', ');
      parts.forEach((part) => {
        if (part.indexOf('red') > -1) {
          const red = part.replace(' red', '');
          if (itemBoxes.red < red) {
            itemBoxes.red = parseInt(red);
          }
          if (red > gameConfiguration.red) {
            valid = false;
          }
        }
        if (part.indexOf('green') > -1) {
          const green = part.replace(' green', '');
          if (itemBoxes.green < green) {
            itemBoxes.green = parseInt(green);
          }
          if (green > gameConfiguration.green) {
            valid = false;
          }
        }
        if (part.indexOf('blue') > -1) {
          const blue = part.replace(' blue', '');
          if (itemBoxes.blue < blue) {
            itemBoxes.blue = parseInt(blue);
          }
          if (blue > gameConfiguration.blue) {
            valid = false;
          }
        }
      });
    });

    const { red, green, blue } = itemBoxes;
    const power = red * green * blue;

    acc += power;

    return acc;
  }, 0);

  return result;
}

/**
 * Executes the algorithm for day 2 (part B) and displays the result.
 */
async function executeDay2b() {
  const answer = await day2b();
  console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
}

executeDay2b(); // Run the algorithm
