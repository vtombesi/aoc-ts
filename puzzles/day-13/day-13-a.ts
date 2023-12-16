import { readData } from '../../shared.ts';
import chalk from 'chalk';

function parseInput(input: string): string[][] {
  return input
    .trim()
    .split(/\n\n/)
    .map((m) => m.split(/\n/));
}

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath, false);

  const patterns = parseInput(data);
  const mirrors: { direction: string; position: number }[] = [];
  let total = 0;

  p: for (const pattern of patterns) {
    for (let i = 1; i < pattern.length; i++) {
      if (checkHorizontal(pattern, i)) {
        mirrors.push({ direction: 'horizontal', position: i });
        total += 100 * i;
        continue p;
      }
    }

    const transposed = transpose(pattern);
    for (let i = 1; i < transposed.length; i++) {
      if (checkHorizontal(transposed, i)) {
        mirrors.push({ direction: 'vertical', position: i });
        total += i;
        continue p;
      }
    }
  }

  function checkHorizontal(pattern: string[], row: number) {
    for (let i = row - 1, j = row; i >= 0 && j < pattern.length; i--, j++) {
      if (pattern[i] !== pattern[j]) return false;
    }
    return true;
  }

  function transpose(pattern: string[]): string[] {
    const result = Array(pattern[0].length).fill('');
    for (const row of pattern) {
      [...row].forEach((c, i) => (result[i] += c));
    }
    return result;
  }

  return total;
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
