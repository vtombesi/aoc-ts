import { readData } from '../../shared.ts';
import chalk from 'chalk';

const tilt = (graph: string[][], dx: number, dy: number): string[][] => {
  for (
    let row: number = dx === 1 ? graph.length - 1 : 0;
    0 <= row && row < graph.length;
    row += dx != 0 ? -dx : 1
  ) {
    for (
      let col: number = dy === 1 ? graph[row].length - 1 : 0;
      0 <= col && col < graph[row].length;
      col += dy != 0 ? -dy : 1
    ) {
      if (graph[row][col] === 'O') {
        let [x, y] = [row, col];
        while (
          0 <= x + dx &&
          x + dx < graph.length &&
          0 <= y + dy &&
          y + dy < graph[x + dx].length &&
          graph[x + dx][y + dy] === '.'
        ) {
          x += dx;
          y += dy;
        }
        graph[row][col] = '.';
        graph[x][y] = 'O';
      }
    }
  }
  return graph;
};

const solve = (input: string): number => {
  let graph: string[][] = input
    .split('\n')
    .map((line: string) => line.split(''));
  graph = tilt(graph, -1, 0);
  let result: number = 0;
  for (let row: number = 0; row < graph.length; row++) {
    for (let col: number = 0; col < graph[row].length; col++) {
      if (graph[row][col] === 'O') result += graph.length - row;
    }
  }
  return result;
};

export async function day14a(dataPath?: string) {
  const data = await readData(dataPath, false);
  return solve(data);
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
