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
    .split(/\n/) // Split input into lines
    .map((line) => {
      const [conditions, runString] = line.split(' '); // Split the line into spring conditions and run lengths
      const runLengths = runString.split(',').map((r) => parseInt(r)); // Convert run lengths to an array of numbers
      return { conditions, runLengths };
    });
}

/**
 * Solves the problem for part A of the day's challenge.
 * @param dataPath - Optional path to the data file.
 * @returns The total count of possible arrangements for damaged springs.
 */
export async function day12a(dataPath?: string): Promise<number> {
  const data = await readData(dataPath, false); // Read input data

  const records = parseInput(data); // Parse input into DamagedRecord objects

  // Iterate over each record to determine possible arrangements of springs
  for (const record of records) {
    const damagedIndices = [...record.conditions.matchAll(/\?/g)].map(
      (m) => m.index
    );

    record.possibleArrangements = [];
    for (let bits = 0; bits < 1 << damagedIndices.length; bits++) {
      let i = 0;
      const arrangement = record.conditions.replace(
        /\?/g,
        (m) => '.#'[(bits >> i++) & 1]
      );
      const runs = damageRuns(arrangement);
      if (arrayEqual(runs, record.runLengths)) {
        record.possibleArrangements.push(arrangement);
      }
      record.possibleCount = record.possibleArrangements.length;
    }
  }

  // Function to calculate damaged springs' run lengths
  function damageRuns(arrangement: string) {
    return [...arrangement.matchAll(/#+/g)].map((m) => m[0].length);
  }

  // Function to check if two arrays are equal
  function arrayEqual(a: number[], b: number[]) {
    return a.length === b.length && a.every((e, i) => e === b[i]);
  }

  // Calculate the total count of possible arrangements for damaged springs
  const totalArrangments = records
    .map((r) => r.possibleCount || 0)
    .reduce((a, b) => a + (b || 0), 0);

  return totalArrangments;
}

// Run the function for part A and display the answer
const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
