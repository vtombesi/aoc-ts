import { readData } from '../../shared.ts';
import chalk from 'chalk';

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export async function day21a(dataPath?: string) {
  const data = await readData(dataPath, false);

  let positions = new Set<string>();
  const map = data.split('\n').map((line, i) =>
    line.split('').map((char, j) => {
      if (char === 'S') {
        positions.add([i, j].join());
      }
      return +(char !== '#');
    })
  );
  for (let i = 0; i < 64; i++) {
    const nextPositions = new Set<string>();
    for (const p of positions) {
      const [r, c] = p.split(',').map(Number);
      for (const [dr, dc] of dirs) {
        if (map[r + dr]?.[c + dc]) {
          nextPositions.add([r + dr, c + dc].join());
        }
      }
    }
    positions = nextPositions;
  }

  return positions.size;
}

const answer = await day21a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
