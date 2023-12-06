import { readData } from '../../shared.ts';
import chalk from 'chalk';

const gameConfiguration: any = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  const result = data.reduce((acc: any, item: string, index: number) => {
    let matches = item.match(/Game (\d+):/);

    let id = parseInt(matches[1]);
    let contentString = item.replace(/^Game \d+: /gm, '');

    let subMatches = contentString.split('; ');

    let valid = true;

    const itemBoxes: any = {
      red: 0,
      blue: 0,
      green: 0,
    };

    console.log(`Analysing id ${id} ---> ${item}`);

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

    console.log(
      id,
      ' --> ',
      `Red: ${red}, Green: ${green}, Blue: ${blue} ---> ${power} ---> acc: ${acc}`
    );

    return acc;
  }, 0);

  return result;
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
