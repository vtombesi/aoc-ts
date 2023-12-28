import { readData } from '../../shared.ts';
import chalk from 'chalk';

let input = ``;

function doIt(rawInput) {
  let lines = rawInput.split('\n');

  let edges = [];
  let vToId = new Map();

  for (let line of lines) {
    let [v1, v2s] = line.split(': ');

    if (!vToId.has(v1)) {
      vToId.set(v1, vToId.size);
    }

    for (let v2 of v2s.split(' ')) {
      if (!vToId.has(v2)) {
        vToId.set(v2, vToId.size);
      }

      edges.push([vToId.get(v1), vToId.get(v2)]);
    }
  }

  while (true) {
    let groups = unionFindThingy(vToId.size, edges, 3);

    if (groups !== null) {
      let group1Count = groups.filter((x) => x === groups[0]).length;
      return group1Count * (vToId.size - group1Count);
    }
  }
}

/**
 *
 * @param {string[]} lines
 * @param {number} group1Root
 * @param {number} group2Root
 */
function unionFindThingy(vertexCount, edges, desiredCuts) {
  //shuffle
  for (let i = 0; i < edges.length; ++i) {
    let idx = Math.floor(Math.random() * i + 1);
    [edges[i], edges[idx]] = [edges[idx], edges[i]];
  }

  let groupParents = [-1];
  let vertexGroups = new Uint16Array(vertexCount);
  let groupPromotions = [-1];

  function union(v1, v2) {
    if (!vertexGroups[v1] && !vertexGroups[v2]) {
      let group = groupParents.length;
      groupParents.push(group);
      groupPromotions.push(1);
      vertexGroups[v1] = group;
      vertexGroups[v2] = group;
    } else if (!vertexGroups[v1]) {
      let g = (vertexGroups[v2] = parent(v2));
      ++groupPromotions[g];
      vertexGroups[v1] = g;
    } else if (!vertexGroups[v2]) {
      let g = (vertexGroups[v1] = parent(v1));
      ++groupPromotions[g];
      vertexGroups[v2] = g;
    } else {
      let g1 = parent(v1);
      let g2 = parent(v2);

      if (g1 !== g2) {
        if (groupPromotions[g1] > groupPromotions[g2]) {
          [g2, g1] = [g1, g2];
        }

        groupPromotions[g2] += groupPromotions[g1] + 1;

        groupParents[g1] = g2;

        vertexGroups[v1] = g2;
        vertexGroups[v2] = g2;
      } else {
        return false;
      }
    }

    return true;
  }

  function parent(v) {
    if (vertexGroups[v] === 0) {
      return -1;
    }

    let group = vertexGroups[v];
    while (group !== groupParents[group]) {
      group = groupParents[group];
    }

    return group;
  }

  let edgeIdx = 0;
  while (vertexCount > 2) {
    let [v1, v2] = edges[edgeIdx++];

    if (union(v1, v2)) {
      --vertexCount;
    }
  }

  let removedEdges = 0;
  for (let [v1, v2] of edges) {
    if ((vertexGroups[v1] = parent(v1)) !== (vertexGroups[v2] = parent(v2))) {
      ++removedEdges;
    }
  }

  if (removedEdges === desiredCuts) {
    return vertexGroups;
  }

  return null;
}

export async function day25a(dataPath?: string) {
  const data = await readData(dataPath, false);
  return doIt(data);
}

const answer = await day25a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
