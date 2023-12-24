import { readData } from '../../shared.ts';
import chalk from 'chalk';

let map;

export async function day23b(dataPath?: string) {
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

  const getGraph = () => {
    const getMoves = (cur) =>
      DS.map((d) => addVect(cur.p, d)).filter((np) => {
        if (
          map[np[1]] === undefined ||
          map[np[1]][np[0]] === undefined ||
          map[np[1]][np[0]] === '#'
        )
          return false;
        return true;
      });

    const addConnectNode = (cur) => {
      // try to locate existing one
      let newJunctionId = nodes.findIndex(
        (n) => n.p[0] == cur.p[0] && n.p[1] == cur.p[1]
      );

      if (newJunctionId === -1) {
        newJunctionId = nodes.length;
        nodes.push({ p: cur.p.slice(), connections: [] });
      }

      if (newJunctionId === cur.lastJunctionId) return newJunctionId;

      // we need to connect cur.lastJunctionId and newJunctionId
      if (
        nodes[cur.lastJunctionId].connections.findIndex(
          (conn) => conn.id === newJunctionId
        ) === -1
      )
        nodes[cur.lastJunctionId].connections.push({
          id: newJunctionId,
          distance: cur.steps - cur.stepsToLastJunction,
        });

      if (
        nodes[newJunctionId].connections.findIndex(
          (conn) => conn.id === cur.lastJunctionId
        ) === -1
      )
        nodes[newJunctionId].connections.push({
          id: cur.lastJunctionId,
          distance: cur.steps - cur.stepsToLastJunction,
        });

      return newJunctionId;
    };

    let stack = [
        { p: [1, 0], steps: 0, lastJunctionId: 0, stepsToLastJunction: 0 },
      ],
      seen = {},
      endPos = [map[0].length - 2, map.length - 1],
      maxSteps = 0;

    let nodes = [{ p: [1, 0], connections: [] }];

    while (stack.length) {
      let cur = stack.pop();

      let k = key(cur.p);

      let moves = getMoves(cur);

      if (moves.length > 2) {
        cur.lastJunctionId = addConnectNode(cur);
        cur.stepsToLastJunction = cur.steps;
      }

      if (seen[k] !== undefined) continue;
      seen[k] = 1;

      if (cur.p[0] == endPos[0] && cur.p[1] == endPos[1]) {
        addConnectNode(cur);
        continue;
      }

      moves.forEach((np) =>
        stack.push({
          p: np,
          steps: cur.steps + 1,
          lastJunctionId: cur.lastJunctionId,
          stepsToLastJunction: cur.stepsToLastJunction,
        })
      );
    }
    return nodes;
  };

  const part2 = () => {
    let nodes = getGraph();

    let stack = [{ p: 0, steps: 0, seen: {} }],
      endPos = nodes.length - 1,
      maxSteps = 0;

    while (stack.length) {
      let cur = stack.pop();

      let k = cur.p;
      cur.seen[k] = 1;

      if (cur.p == endPos) {
        maxSteps = Math.max(cur.steps, maxSteps);
        continue;
      }

      nodes[k].connections
        .filter((n) => cur.seen[n.id] === undefined)
        .forEach((n) =>
          stack.push({
            p: n.id,
            steps: cur.steps + n.distance,
            seen: { ...cur.seen },
          })
        );
    }

    return maxSteps;
  };

  return part2();
}

const answer = await day23b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
