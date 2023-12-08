import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Instruction = 'R' | 'L';
type Node = { L: string; R: string };
interface Problem {
  instructions: Instruction[];
  nodes: Record<string, Node>;
}

function parseInput(input: string): Problem {
  const [line1, _, ...lines] = input.split('\n');
  const nodes: Record<string, Node> = {};
  lines.forEach(
    (line) =>
      (nodes[line.slice(0, 3)] = {
        L: line.slice(7, 10),
        R: line.slice(12, 15),
      })
  );

  return {
    instructions: [...line1] as Instruction[],
    nodes,
  };
}

function loop<T>(arr: T[], callback: (val: T) => boolean) {
  for (let i = 0; callback(arr[i]); i = (i + 1) % arr.length);
}

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath, false);

  const { instructions, nodes } = parseInput(data);
  let steps = 0;
  let curr = 'AAA';
  loop(
    instructions,
    (instr) => (++steps, (curr = nodes[curr][instr]), curr !== 'ZZZ')
  );

  return steps;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
