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

export async function day19b(dataPath?: string) {
  const data = await readData(dataPath, false);

  const { workflows } = parseInput(data);

  type Range = [number, number]; // half open interval; lo <= x < hi
  type PartBatch = {
    x: Range;
    m: Range;
    a: Range;
    s: Range;
  };

  function rangeSize(r: Range) {
    return r[1] - r[0];
  }
  function batchSize(batch: PartBatch) {
    return (
      rangeSize(batch.x) *
      rangeSize(batch.m) *
      rangeSize(batch.a) *
      rangeSize(batch.s)
    );
  }

  const acceptedBatches: {
    batch: PartBatch;
    history: string[];
    size: number;
  }[] = [];
  function countAccepted(batch: PartBatch, workflowName, history: string[]) {
    if (workflowName === 'R') return 0;

    history = history.concat(workflowName);
    if (workflowName === 'A') {
      const size = batchSize(batch);
      acceptedBatches.push({ batch, history, size });
      return size;
    }

    let result = 0;
    const workflow = workflows[workflowName];
    for (const rule of workflow.rules) {
      const range = batch[rule.type];
      switch (rule.op) {
        case '<':
          if (range[1] <= rule.value) {
            // entire batch satisfies
            result += countAccepted(batch, rule.target, history);
            return result;
          } else if (range[0] < rule.value) {
            // part of batch satisfies; split it up
            const matchedPart: PartBatch = {
              ...batch,
              [rule.type]: [range[0], rule.value],
            };
            result += countAccepted(matchedPart, rule.target, history);

            batch = { ...batch, [rule.type]: [rule.value, range[1]] };
            continue;
          }
          break;

        case '>':
          if (range[0] > rule.value) {
            // entire batch satisfies
            result += countAccepted(batch, rule.target, history);
            return result;
          } else if (range[1] > rule.value + 1) {
            // part of batch satisfies; split it up
            const matchedPart: PartBatch = {
              ...batch,
              [rule.type]: [rule.value + 1, range[1]],
            };
            result += countAccepted(matchedPart, rule.target, history);

            batch = { ...batch, [rule.type]: [range[0], rule.value + 1] };
            continue;
          }
          break;
      }
    }
    // whatever's left goes to default;
    result += countAccepted(batch, workflow.defaultTarget, history);
    return result;
  }

  debugger;
  const totalAccepted = countAccepted(
    { x: [1, 4001], m: [1, 4001], a: [1, 4001], s: [1, 4001] },
    'in',
    []
  );

  return totalAccepted;
}

const answer = await day19b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
