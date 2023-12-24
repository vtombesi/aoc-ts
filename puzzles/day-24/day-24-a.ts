import { readData } from '../../shared.ts';

function baseInRange(number, start, end) {
  return number >= Math.min(start, end) && number < Math.max(start, end);
}

function inRange(number, start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return baseInRange(+number, +start, +end);
}

const gcd = (a, b) => (a ? gcd(b % a, a) : b);

export const lcm = (a, b) => (a * b) / gcd(a, b);

export type ICoord = { x: number; y: number };
export type ICoord3d = { x: number; y: number; z: number };

const getNear = (y: number, x: number) => {
  return [
    [y + 1, x],
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
  ];
};

import chalk from 'chalk';

export const getNumbersFromString = (i: string): number[] => {
  const arr = i.match(/-?(\d+)/gm)?.map((v) => Number(v));
  if (!arr) return [];
  return arr;
};

function intersect2(x1, y1, x2, y2, x3, y3, x4, y4) {
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
  }

  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
}

const getPointAtT = (
  point: { point: number[]; speed: number[] },
  t: number,
  z?: boolean
) => {
  const p = [
    point.point[0] + point.speed[0] * t,
    point.point[1] + point.speed[1] * t,
  ];

  if (z) {
    p.push(point.point[2] + point.speed[2] * t);
  }
  return p;
};

export async function day24a(dataPath?: string) {
  const input = await readData(dataPath, false);

  const inputs = input.split('\n');

  const s1 = input.split('\n').map((v) => {
    const [coords, speed] = v.split('@');

    return {
      point: getNumbersFromString(coords),
      speed: getNumbersFromString(speed),
    };
  });

  const inputParsed = {
    points: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const first: IF = ({ points }) => {
    const intersections = new Set<string>();

    // const rangeStart = 7;
    // const rangeEnd = 27;
    const rangeStart = 200000000000000;
    const rangeEnd = 400000000000000;

    let checked = 0;

    for (let a = 0; a < points.length; a++) {
      const [x1, y1] = getPointAtT(points[a], 0);
      const [x2, y2] = getPointAtT(points[a], 1);

      for (let b = a + 1; b < points.length; b++) {
        if (b === a) continue;
        checked++;
        const [x3, y3] = getPointAtT(points[b], 0);
        const [x4, y4] = getPointAtT(points[b], 1);

        const inter = intersect2(x1, y1, x2, y2, x3, y3, x4, y4);

        if (inter) {
          const { x, y } = inter;

          if (
            x > x1 == x2 - x1 > 0 &&
            y > y1 == y2 - y1 > 0 &&
            x > x3 == x4 - x3 > 0 &&
            y > y3 == y4 - y3 > 0 &&
            inRange(x, rangeStart, rangeEnd) &&
            inRange(y, rangeStart, rangeEnd)
          ) {
            intersections.add(`${a}-${b}`);
          }
        }
      }
    }

    return intersections.size;
  };

  return first(inputParsed);
}

const answer = await day24a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
