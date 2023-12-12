import { readData } from '../../shared.ts';
import chalk from 'chalk';

/**
 * Defines an object representing a damaged record.
 */
type DamagedRecord = {
  conditions: string; // Springs conditions: '#' for broken, '.' for operational, '?' for unknown
  runLengths: number[]; // Lengths of consecutive groups of damaged springs
  possibleArrangements?: string[]; // Array of possible arrangements of springs
  possibleCount?: number; // Number of possible arrangements
};

/**
 * Parses the input and converts it into DamagedRecord objects.
 * @param input - Input string containing information about damaged records.
 * @returns An array of DamagedRecord objects.
 */
function parseInput(input: string): DamagedRecord[] {
  return input
    .trim()
    .split(/\n/)
    .map((line) => {
      const [conditions, runString] = line.split(' ');
      const runLengths = runString.split(',').map((r) => parseInt(r));
      return { conditions, runLengths };
    });
}

/**
 * Solves the problem for part B of the day's challenge.
 * @param dataPath - Optional path to the data file.
 * @returns The new sum of possible arrangement counts for the unfolded condition records.
 */
export async function day12b(dataPath?: string) {
  const data = await readData(dataPath, false);

  const records = parseInput(data);

  let i = 0;
  // quintuple each record.
  for (const record of records) {
    record.conditions +=
      '?' +
      record.conditions +
      '?' +
      record.conditions +
      '?' +
      record.conditions +
      '?' +
      record.conditions;
    record.runLengths = [
      ...record.runLengths,
      ...record.runLengths,
      ...record.runLengths,
      ...record.runLengths,
      ...record.runLengths,
    ];

    // given each run must be separated by 1 working spring
    const minLength = record.runLengths.reduce((a, b) => a + b + 1);
    record.possibleCount = countArrangments(
      record.conditions,
      0,
      record.runLengths,
      minLength,
      []
    );
  }

  /**
   * Recursively counts the possible arrangements for damaged springs.
   * @param conditions - String representing spring conditions.
   * @param pos - Current position in the conditions string.
   * @param runs - Array of damaged spring lengths.
   * @param minLength - Minimum length required for a valid arrangement.
   * @param memo - Memoization for dynamic programming.
   * @returns The number of possible arrangements.
   */
  function countArrangments(
    conditions: string,
    pos: number,
    runs: number[],
    minLength: number,
    memo: number[][]
  ): number {
    // memo is indexed by pos, then by runs.length

    function memoize(result: number) {
      return ((memo[pos] ??= [])[runs.length] = result);
    }

    if (typeof memo[pos]?.[runs.length] === 'number') {
      return memo[pos][runs.length];
    }
    if (runs.length === 0) {
      return conditions.indexOf('#', pos) >= 0 ? 0 : 1;
    } else if (pos + minLength > conditions.length) {
      return memoize(0);
    } else if (conditions[pos] === '.') {
      let nextPos = pos;
      while (conditions[nextPos] === '.') nextPos++;
      return memoize(
        countArrangments(conditions, nextPos, runs, minLength, memo)
      );
    } else if (pos >= conditions.length) {
      return memoize(runs.length === 0 ? 1 : 0);
    } else if (conditions[pos] === '#') {
      // check for run starting at pos followed by an undamaged spring
      if (conditions.length - pos < runs[0]) return memoize(0);
      for (let i = 0; i < runs[0]; i++) {
        if (conditions[pos + i] === '.') return memoize(0);
      }
      if (conditions[pos + runs[0]] === '#') return memoize(0);
      return memoize(
        countArrangments(
          conditions,
          pos + runs[0] + 1,
          runs.slice(1),
          minLength - runs[0] - 1,
          memo
        )
      );
    } else if (conditions[pos] === '?') {
      // without a run starting at pos
      let result = countArrangments(conditions, pos + 1, runs, minLength, memo);

      if (conditions.length - pos < runs[0]) return memoize(result);
      for (let i = 0; i < runs[0]; i++) {
        if (conditions[pos + i] === '.') return memoize(result);
      }
      if (conditions[pos + runs[0]] === '#') return memoize(result);

      // also with a run starting at pos
      result += countArrangments(
        conditions,
        pos + runs[0] + 1,
        runs.slice(1),
        minLength - runs[0] - 1,
        memo
      );
      return memoize(result);
    }
    throw Error("This shouldn't happen");
  }

  const totalArrangments = records
    .map((r) => r.possibleCount)
    .reduce((a, b) => a + b);

  return totalArrangments;
}

// Compute the answer for part B and display it
const answer = await day12b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
