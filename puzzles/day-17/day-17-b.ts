import { readData } from '../../shared.ts';
import chalk from 'chalk';

export type Grid = number[][];

export async function getInput(text: string) {
  return text.split('\n').map((line) => line.split('').map(Number)) as Grid;
}

export type Queued = [
  heatLoss: number,
  row: number,
  column: number,
  deltaRow: number,
  deltaColumn: number,
  steps: number
];

export function getMinHeatLoss(grid: Grid) {
  const queue: Queued[] = [[0, 0, 0, 0, 0, 0]];

  const seen = new Set<string>();

  while (queue.length) {
    const [hl, r, c, dr, dc, n] = queue
      .sort(([prevCost], [nextCost]) => nextCost - prevCost)
      .pop()!;

    if (r === grid.length - 1 && c === grid[0].length - 1 && n >= 4) return hl;

    const key = JSON.stringify([r, c, dr, dc, n]);

    if (seen.has(key)) continue;

    seen.add(key);

    if (n < 10 && ![dr, dc].every((coord) => coord === 0)) {
      const nr = r + dr;
      const nc = c + dc;

      if (0 <= nr && nr < grid.length && 0 <= nc && nc < grid[0].length) {
        queue.push([hl + grid[nr][nc], nr, nc, dr, dc, n + 1]);
      }
    }

    if (n >= 4 || [dr, dc].every((coord) => coord === 0)) {
      for (const [ndr, ndc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        if (
          JSON.stringify([ndr, ndc]) !== JSON.stringify([dr, dc]) &&
          JSON.stringify([ndr, ndc]) !== JSON.stringify([-dr, -dc])
        ) {
          const nr = r + ndr;
          const nc = c + ndc;

          if (0 <= nr && nr < grid.length && 0 <= nc && nc < grid[0].length) {
            queue.push([hl + grid[nr][nc], nr, nc, ndr, ndc, 1]);
          }
        }
      }
    }
  }

  return 0;
}

export async function day17b(dataPath?: string) {
  const data = await readData(dataPath, false);

  const grid = await getInput(data);

  const result = getMinHeatLoss(grid);

  return result;
}

const answer = await day17b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
