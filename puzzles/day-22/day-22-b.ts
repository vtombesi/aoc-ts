import { readData } from '../../shared.ts';
import chalk from 'chalk';

function getPrecaroiusBricks(input: string): number {
  const bricks: number[][] = [];

  input.split('\n').forEach((line) => {
    const values = split(line, '~', ',');
    const brick: number[] = [];
    values.forEach((v) => {
      const num = parseInt(v, 10);
      brick.push(num);
    });
    bricks.push(brick);
  });

  bricks.sort((a, b) => a[2] - b[2]);

  for (let index = 0; index < bricks.length; index++) {
    let maxZ = 1;
    for (let i = 0; i < index; i++) {
      if (isOverlapping(bricks[index], bricks[i])) {
        maxZ = max(maxZ, bricks[i][5] + 1);
      }
    }
    bricks[index][5] -= bricks[index][2] - maxZ;
    bricks[index][2] = maxZ;
  }

  bricks.sort((a, b) => a[2] - b[2]);

  const kSupportsV: Record<number, Set<number>> = {};
  const vSupportsK: Record<number, Set<number>> = {};

  for (let i = 0; i < bricks.length; i++) {
    kSupportsV[i] = new Set();
    vSupportsK[i] = new Set();
  }

  for (let j = 0; j < bricks.length; j++) {
    for (let i = 0; i < j; i++) {
      if (
        isOverlapping(bricks[i], bricks[j]) &&
        bricks[j][2] === bricks[i][5] + 1
      ) {
        kSupportsV[i].add(j);
        vSupportsK[j].add(i);
      }
    }
  }

  let total = 0;

  for (let i = 0; i < bricks.length; i++) {
    const q: number[] = [];
    for (let j of kSupportsV[i]) {
      if (vSupportsK[j].size === 1) {
        q.push(j);
      }
    }

    const falling = new Set<number>(q);
    falling.add(i);

    while (q.length > 0) {
      const j = q.shift()!;
      for (let k of kSupportsV[j]) {
        if (!falling.has(k)) {
          if (isSubsetOf(vSupportsK[k], falling)) {
            q.push(k);
            falling.add(k);
          }
        }
      }
    }

    total += falling.size - 1;
  }

  return total;
}

function split(s: string, sep1: string, sep2: string): string[] {
  s = s.replace(sep1, sep2);
  return s.split(sep2);
}

function isOverlapping(a: number[], b: number[]): boolean {
  return (
    max(a[0], b[0]) <= min(a[3], b[3]) && max(a[1], b[1]) <= min(a[4], b[4])
  );
}

function isSubsetOf(set1: Set<number>, set2: Set<number>): boolean {
  for (let key of set1) {
    if (!set2.has(key)) {
      return false;
    }
  }
  return true;
}

function max(a: number, b: number): number {
  return a > b ? a : b;
}

function min(a: number, b: number): number {
  return a < b ? a : b;
}

export async function day22b(dataPath?: string) {
  const data = await readData(dataPath, false);
  return getPrecaroiusBricks(data);
}

const answer = await day22b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
