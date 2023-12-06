import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath, false);

  const grid = data.split(/\n/g).map((line) => line.split(''));

  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    let currentNumber = '',
      checkNumber = false,
      nearSymbol = false;

    for (let x = 0; x < grid[y].length; x++) {
      // if current spot is a number and we aren't checking them yet, start checking
      if (grid[y][x].match(/[0-9]/) && !checkNumber) {
        checkNumber = true;
        currentNumber = '';
        nearSymbol = false;
      }

      // if we find a non-number or at end of the row, stop checking and add to sum if needed
      if (
        (x == grid[y].length - 1 || !grid[y][x].match(/[0-9]/)) &&
        checkNumber
      ) {
        if (nearSymbol)
          sum += parseInt(
            currentNumber + (grid[y][x].match(/[0-9]/) ? grid[y][x] : '')
          );
        checkNumber = false;
      }

      // if we are checking for numbers, add current spot to number and check for symbols around it
      if (checkNumber) {
        currentNumber += grid[y][x];

        // check for symbol around current spot
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            if (i == 0 && j == 0) continue;
            if (
              y + j < 0 ||
              y + j >= grid.length ||
              x + i < 0 ||
              x + i >= grid[y].length
            )
              continue;

            // anything that is not a number or . is a symbol
            if (!grid[y + j][x + i].match(/[0-9.]/)) nearSymbol = true;
          }
        }
      }
    }
  }

  return sum;
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
