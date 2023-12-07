import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day5a(dataPath?: string) {
  const data: any = await readData(dataPath, false);
  let [seeds, ...maps] = data.split(/\n\n/g);

  console.log(data.split(/\n\n/g));

  seeds = seeds
    .split(/: /)[1]
    .split(/ /g)
    .map((num) => parseInt(num));
  maps = maps.reduce((obj, map) => {
    let [name, ...locations] = map.split(/\n/g);
    obj[name.split(/ /)[0]] = locations.map((numbers) =>
      numbers.split(/ /).map((num) => parseInt(num))
    );
    return obj;
  }, {});

  let mapNames = Object.keys(maps);

  let source = seeds;
  for (let i = 0; i < mapNames.length; i++) {
    let destination = maps[mapNames[i]];

    for (let i = 0; i < source.length; i++) {
      let newNumber = source[i];
      for (let j = 0; j < destination.length; j++) {
        if (
          newNumber >= destination[j][1] &&
          newNumber <= destination[j][1] + destination[j][2]
        ) {
          newNumber = newNumber - destination[j][1] + destination[j][0];
          break;
        }
      }
      source[i] = newNumber;
    }
  }

  return source.reduce((min, num) => Math.min(min, num), Infinity);
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
