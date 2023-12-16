import { readData } from '../../shared.ts';
import chalk from 'chalk';

function parseInput(input: string): string[][] {
  return input
    .trim()
    .split(/\n\n/)
    .map((m) => m.split(/\n/));
}

export async function day13b(dataPath?: string) {
  const data = await readData(dataPath, false);

  type SmudgePosition = { row: number; col: number };

  const patterns = parseInput(data);
  const mirrors: {
    direction: string;
    position: number;
    smudge: SmudgePosition;
  }[] = [];
  let total = 0;

  p: for (const pattern of patterns) {
    for (let i = 1; i < pattern.length; i++) {
      const check = checkHorizontal(pattern, i);
      if (check) {
        mirrors.push({ direction: 'horizontal', position: i, smudge: check });
        total += 100 * i;
        continue p;
      }
    }

    const transposed = transpose(pattern);
    for (let i = 1; i < transposed.length; i++) {
      const check = checkHorizontal(transposed, i);
      if (check) {
        const transposedSmudge = { row: check.col, col: check.row };
        mirrors.push({
          direction: 'vertical',
          position: i,
          smudge: transposedSmudge,
        });
        total += i;
        continue p;
      }
    }
  }

  function checkHorizontal(
    pattern: string[],
    row: number
  ): SmudgePosition | undefined {
    let smudgeRow = NaN,
      smudgeCol = NaN;
    for (let i = row - 1, j = row; i >= 0 && j < pattern.length; i--, j++) {
      const pi = pattern[i],
        pj = pattern[j];
      for (let k = 0; k < pi.length; k++) {
        if (pi[k] !== pj[k]) {
          if (!isNaN(smudgeRow)) return;
          smudgeRow = i;
          smudgeCol = k;
        }
      }
    }
    if (!isNaN(smudgeRow)) return { row: smudgeRow, col: smudgeCol };
  }

  function transpose(pattern: string[]): string[] {
    const result = Array(pattern[0].length).fill('');
    for (const row of pattern) {
      [...row].forEach((c, i) => (result[i] += c));
    }
    return result;
  }

  return total;

  return 0;
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
