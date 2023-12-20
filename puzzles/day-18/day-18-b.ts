import { readData } from '../../shared.ts';
import chalk from 'chalk';

export type Point = [x: number, y: number];

export type DirectionChar = 'R' | 'D' | 'L' | 'U';

export type Move = [direction: DirectionChar, amount: number];

export type Instruction = [partOne: Move, partTwo: Move];

export async function getInput(text: string) {
  return text.split('\n').map((line) => {
    const [direction, amount, color] = line.split(' ');

    return [
      [direction, Number(amount)],
      ['RDLU'.at(Number(color.at(-2))), parseInt(color.slice(2, -2), 16)],
    ] as Instruction;
  });
}

export const deltas: Record<DirectionChar, Point> = {
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0],
  U: [0, -1],
};

export function escavate(instructions: Instruction[]) {
  const moves = instructions.map((instruction) => instruction[1]);

  let perimeter = 0;

  const points: Point[] = [[0, 0]];

  for (const [direction, amount] of moves) {
    const [prevX, prevY] = points.at(-1)!;
    const [deltaX, deltaY] = deltas[direction];

    perimeter += amount;
    points.push([prevX + deltaX * amount, prevY + deltaY * amount]);
  }

  let area = 0;

  for (const index of points.keys()) {
    area +=
      ((points[index][1] + points[(index + 1) % points.length][1]) *
        (points[index][0] - points[(index + 1) % points.length][0])) /
      2;
  }

  // The extra +1 comes from the fact that an inside corner has 3/4 of the tile in the area,
  // an outside corner has 1/4 of the tile in the area, and there are exactly 4 more outside corners than inside corners.
  return area + perimeter / 2 + 1;
}

export function getArea(instructions: Instruction[]) {
  return escavate(instructions);
}

export async function day18b(dataPath?: string) {
  const data = await readData(dataPath, false);
  const instructions = await getInput(data);
  return getArea(instructions);
}

const answer = await day18b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
