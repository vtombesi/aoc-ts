import { readData } from '../../shared.ts';
import chalk from 'chalk';

const TOTAL_CYCLES = 1e9;

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
  const previousStates: Map<string, number> = new Map<string, number>();
  for (let spinCycles = 0; spinCycles < TOTAL_CYCLES; spinCycles++) {
    const graphState: string = graph
      .map((line: string[]) => line.join(''))
      .join('\n');
    if (previousStates.has(graphState)) {
      const stateCycleLength: number =
        spinCycles - previousStates.get(graphState)!;
      const remainingSpinCycles: number = TOTAL_CYCLES - spinCycles;
      spinCycles +=
        Math.floor(remainingSpinCycles / stateCycleLength) * stateCycleLength;
    }
    previousStates.set(graphState, spinCycles);
    graph = tilt(tilt(tilt(tilt(graph, -1, 0), 0, -1), 1, 0), 0, 1);
  }
  let result: number = 0;
  for (let row: number = 0; row < graph.length; row++) {
    for (let col: number = 0; col < graph[row].length; col++) {
      if (graph[row][col] === 'O') result += graph.length - row;
    }
  }
  return result;
};

export async function day14b(dataPath?: string) {
  const data = await readData(dataPath, false);
  return solve(data);
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
