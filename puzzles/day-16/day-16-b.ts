import { readData } from '../../shared.ts';
import chalk from 'chalk';

export function inRange(
  value: number,
  [min, max]: [min: number, max: number],
  offset = 0
) {
  return (value - (min - offset)) * (value - (max + offset)) <= 0;
}

export type Point = [x: number, y: number];

export type Line = [start: Point, end: Point];

export function isAdjacent(
  [x, y]: Point,
  [[x1, y1], [x2, y2]]: Line,
  offset = 1
) {
  return inRange(x, [x1, x2], offset) && inRange(y, [y1, y2], offset);
}

export function taxicab([x1, y1]: Point, [x2, y2]: Point) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export class Points<TPoint extends Point = Point> {
  #set: Set<string>;

  constructor(iterable?: TPoint[] | Points<TPoint> | Set<TPoint>) {
    if (!iterable) {
      this.#set = new Set<string>();
      return;
    }

    const strings = [...iterable].map((point) => JSON.stringify(point));
    this.#set = new Set<string>(strings);
  }

  get size() {
    return this.#set.size;
  }

  *[Symbol.iterator]() {
    for (const value of this.#set[Symbol.iterator]()) {
      yield JSON.parse(value) as TPoint;
    }
  }

  add(point: TPoint) {
    this.#set.add(JSON.stringify(point));
    return this;
  }

  clear() {
    this.#set.clear();
  }

  delete(point: TPoint) {
    return this.#set.delete(JSON.stringify(point));
  }

  *entries(): IterableIterator<[TPoint, TPoint]> {
    for (const [value1, value2] of this.#set.entries()) {
      yield [JSON.parse(value1), JSON.parse(value2)] as [
        point: TPoint,
        point: TPoint
      ];
    }
  }

  forEach(
    callbackfn: (point: TPoint, point2: TPoint, points: Points<TPoint>) => void,
    thisArg?: any
  ) {
    this.#set.forEach((value) => {
      const point = JSON.parse(value) as TPoint;
      callbackfn.call(thisArg, point, point, this);
    });
  }

  has(point: TPoint) {
    return this.#set.has(JSON.stringify(point));
  }

  *keys(): IterableIterator<TPoint> {
    for (const key of this.#set.keys()) {
      yield JSON.parse(key) as TPoint;
    }
  }

  *values(): IterableIterator<TPoint> {
    for (const value of this.#set.values()) {
      yield JSON.parse(value) as TPoint;
    }
  }
}

export type Tile = '.' | '/' | '\\' | '|' | '-';

export type Grid = Tile[][];

export async function parseInput(text: string) {
  return text.split('\n').map((line) => line.split('') as Tile[]) as Grid;
}

export type PosDelta = [position: Point, delta: Point];

export function getEnergizedTiles(grid: Grid, start: PosDelta) {
  const beams = new Map<string, PosDelta>([[crypto.randomUUID(), start]]);

  const energized = new Map<string, string[]>();

  while (beams.size) {
    for (const [id, [[bx, by], [dx, dy]]] of beams) {
      if (by < 0 || by > grid.length - 1 || bx < 0 || bx > grid[0].length - 1) {
        beams.delete(id);
        continue;
      }

      const key = JSON.stringify([bx, by]);
      const value = JSON.stringify([
        [bx, by],
        [dx, dy],
      ]);

      if (energized.get(key)?.includes(value)) {
        beams.delete(id);
        continue;
      }

      if (energized.has(key)) {
        energized.get(key)?.push(value);
      } else {
        energized.set(key, [value]);
      }

      const tile = grid[by][bx];

      // Split vertically
      if (!dy && tile === '|') {
        beams.set(crypto.randomUUID(), [
          [bx, by - 1],
          [0, -1],
        ]);
        beams.set(crypto.randomUUID(), [
          [bx, by + 1],
          [0, 1],
        ]);
        beams.delete(id);
        continue;
      }

      // Split horizontally
      if (!dx && tile === '-') {
        beams.set(crypto.randomUUID(), [
          [bx - 1, by],
          [-1, 0],
        ]);
        beams.set(crypto.randomUUID(), [
          [bx + 1, by],
          [1, 0],
        ]);
        beams.delete(id);
        continue;
      }

      // Horizontal to up
      if ((dx === 1 && tile === '/') || (dx === -1 && tile === '\\')) {
        beams.set(id, [
          [bx, by - 1],
          [0, -1],
        ]);
        continue;
      }

      // Horizontal to down
      if ((dx === 1 && tile === '\\') || (dx === -1 && tile === '/')) {
        beams.set(id, [
          [bx, by + 1],
          [0, 1],
        ]);
        continue;
      }

      // Vertical to left
      if ((dy === 1 && tile === '/') || (dy === -1 && tile === '\\')) {
        beams.set(id, [
          [bx - 1, by],
          [-1, 0],
        ]);
        continue;
      }

      // Vertical to right
      if ((dy === 1 && tile === '\\') || (dy === -1 && tile === '/')) {
        beams.set(id, [
          [bx + 1, by],
          [1, 0],
        ]);
        continue;
      }

      // Continue in original direction
      beams.set(id, [
        [bx + dx, by + dy],
        [dx, dy],
      ]);
    }
  }

  return energized.size;
}

export function getEnergizedTilesFromEdges(grid: Grid) {
  let energizedTiles = 0;

  for (const y of grid.keys()) {
    energizedTiles = Math.max(
      energizedTiles,
      getEnergizedTiles(grid, [
        [0, y],
        [1, 0],
      ]),
      getEnergizedTiles(grid, [
        [grid[0].length - 1, y],
        [-1, 0],
      ])
    );
  }

  for (const x of grid[0].keys()) {
    energizedTiles = Math.max(
      energizedTiles,
      getEnergizedTiles(grid, [
        [x, 0],
        [0, 1],
      ]),
      getEnergizedTiles(grid, [
        [x, grid.length - 1],
        [0, -1],
      ])
    );
  }

  return energizedTiles;
}

export async function day16b(dataPath?: string) {
  const data = await readData(dataPath, false);

  const grid = await parseInput(data);

  const energizedTilesFromEdges = getEnergizedTilesFromEdges(grid);

  return energizedTilesFromEdges;
}

const answer = await day16b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
