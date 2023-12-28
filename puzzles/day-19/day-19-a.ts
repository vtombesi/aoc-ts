import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
  history: string[];
  total?: number;
};
type Rule = {
  type: 'x' | 'm' | 'a' | 's';
  op: '<' | '>';
  value: number;
  target: string;
};
type Workflow = {
  rules: Rule[];
  defaultTarget: string;
};
type Job = {
  parts: Part[];
  workflows: Record<string, Workflow>;
};

const model: any = {
  input: '',
  appliedInput: '',
  runPart: 0,
  startRun(part: number) {
    model.runPart = part;
    model.appliedInput = model.input;
  },
};

function parseInput(input: string): Job {
  const [workflowsStr, partsStr] = input.trim().split(/\n\n/);
  const workflowEntries = [...workflowsStr.split(/\n/)].map((w) => {
    const name = /^\w+/.exec(w)[0];
    const rules = [...w.matchAll(/([xmas])([<>])(\d+):(\w+)/g)].map(
      (m) =>
        ({
          type: m[1] as 'x' | 'm' | 'a' | 's',
          op: m[2] as '<' | '>',
          value: parseInt(m[3]),
          target: m[4],
        } satisfies Rule)
    );
    const defaultTarget = /,(\w+)\}$/.exec(w)[1];
    const workflow: Workflow = {
      rules,
      defaultTarget,
    };
    return [name, workflow];
  });
  const workflows = Object.fromEntries(workflowEntries);

  const parts = partsStr.split(/\n/).map((line) => {
    const partEntries = [...line.matchAll(/([xmas])=(\d+)/g)].map((m) => [
      m[1],
      parseInt(m[2]),
    ]);
    const part: Part = Object.assign(Object.fromEntries(partEntries), {
      history: [],
    });
    return part;
  });

  const job: Job = { parts, workflows };
  return job;
}

function op(v1: number, op: '<' | '>', v2: number) {
  return op === '<' ? v1 < v2 : v1 > v2;
}

export async function day19a(dataPath?: string) {
  const data = await readData(dataPath, false);

  const job = parseInput(data);

  let total = 0;
  for (const part of job.parts) {
    let workflowName = 'in';
    part.history.push(workflowName);
    while (workflowName !== 'R' && workflowName !== 'A') {
      const workflow = job.workflows[workflowName];
      workflowName =
        workflow.rules.find((rule) => op(part[rule.type], rule.op, rule.value))
          ?.target ?? workflow.defaultTarget;
      part.history.push(workflowName);
    }
    if (workflowName === 'A') {
      total += part.total = part.x + part.m + part.a + part.s;
    }
  }

  return total;
}

const answer = await day19a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
