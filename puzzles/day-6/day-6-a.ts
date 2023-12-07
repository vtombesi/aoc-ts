import { readData } from '../../shared.ts';
import chalk from 'chalk';

function winsPossible(time: number, record: number): number {
  // distance is: distance = hold time * (time - hold time)
  function distance(holdTime: number, time: number): number {
    return holdTime * (time - holdTime);
  }

  // wins possible should be all the hold times between
  // - the minimum hold time necessary to win
  // - the maximum hold time necessary to win
  //
  // winning means you beat the record (d > record)
  //
  // So for hold time (t) the formula is: t * (time - t) > record
  //
  // For simplicity, let's aim for the spot where you tie the record:
  // = t * (time - t) = record
  // = -t^2 + t(time) = record
  // = -t^2 + t(time) - record = 0
  // ... a quadratic equation!

  // to solve the quadratic, first we need to find the discriminant D:
  // quadratic formula is ax^2 + bx + c (x is our unknown variable t)
  // D = b^2 - 4ac
  // a = -1
  // b = time
  // c = -record
  // therefore, D = time^2 - 4 * -1 * -record = time^2 - 4 * record
  const D = time * time - 4 * record;

  // now we can solve for x:
  // x = (-b +/- sqrt(D)) / 2a
  // x = (-time +/- sqrt(D)) / -2
  let shortest = Math.ceil((-time + Math.sqrt(D)) / -2);
  let longest = Math.floor((-time - Math.sqrt(D)) / -2);

  // Okay, so now we know the APPROXIMATE hold times to tie (we rounded since the hold time has to be whole numbers)
  // We need to figure out where the limit is for winning.
  // Let's back off by 1 in case rounding bumped us outside of a win.
  shortest += 1;
  longest -= 1;

  // oookay, so now we're really close to our shortest and longest times to win
  // We should only be off by 1 or 2

  // walk shortest backwards until we stop winning
  while (true) {
    const t = shortest - 1;
    if (distance(t, time) > record) {
      shortest = t;
    } else {
      break;
    }
  }

  // walk longest forward until we stop winning
  while (true) {
    const t = longest + 1;
    if (distance(t, time) > record) {
      longest = t;
    } else {
      break;
    }
  }

  return longest - shortest + 1;
}

export async function day6a(dataPath?: string) {
  const lines = await readData(dataPath);

  const times = lines[0]
    .split(/\s+/)
    .slice(1)
    .map((v) => parseInt(v));
  const distances = lines[1]
    .split(/\s+/)
    .slice(1)
    .map((v) => parseInt(v));

  const answer = times
    .map((t, i) => winsPossible(t, distances[i]))
    .reduce((acc, cur) => acc * cur, 1);
  console.log(`Part 1: ${answer}`);

  return answer;
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
