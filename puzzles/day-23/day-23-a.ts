import { readData } from '../../shared.ts';
import chalk from 'chalk';

let map;

export async function day23a(dataPath?: string) {
  const data = await readData(dataPath, false);

  map = data.split('\n').map((line, y) =>
    line.split('').map((v, x) => {
      return v;
    })
  );

  const DS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const D = { '>': 0, v: 1, '<': 2, '^': 3 };

  const key = (p) => p[0] + '_' + p[1];
  const addVect = (a, b) => [a[0] + b[0], a[1] + b[1]];

  const part1 = () => {
    const getMoves = (cur) => {
      let moves = [];

      let v = map[cur.p[1]][cur.p[0]];

      if (D[v] !== undefined) moves.push(addVect(cur.p, DS[D[v]]));
      else DS.forEach((d) => moves.push(addVect(cur.p, d)));

      return moves.filter((np) => {
        if (
          map[np[1]] === undefined ||
          map[np[1]][np[0]] === undefined ||
          map[np[1]][np[0]] === '#'
        )
          return false;
        if (cur.seen[key(np)] !== undefined) return false;
        return true;
      });
    };

    let stack = [{ p: [1, 0], steps: 0, seen: {} }],
      endPos = [map[0].length - 2, map.length - 1],
      maxSteps = 0;

    while (stack.length) {
      let cur = stack.pop();

      let k = key(cur.p);
      cur.seen[k] = 1;

      let moves = getMoves(cur);
      while (moves.length == 1) {
        cur.seen[key(moves[0])] = 1;
        cur.steps++;
        cur.p = moves[0];
        moves = getMoves(cur);
      }

      if (cur.p[0] == endPos[0] && cur.p[1] == endPos[1]) {
        maxSteps = Math.max(maxSteps, cur.steps);
        continue;
      }

      moves.forEach((np) =>
        stack.push({
          p: np,
          steps: cur.steps + 1,
          seen: { ...cur.seen },
        })
      );
    }
    return maxSteps;
  };

  return part1();
}

const answer = await day23a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
