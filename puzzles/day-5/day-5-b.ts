import { readData } from '../../shared.ts';
import chalk from 'chalk';

const DATA = [];

const mapSeedToSoil = [];

const mapSoilToFertil = [];

const mapFertilToWater = [];

const mapWaterToLight = [];

const mapLightToTemper = [];

const mapTemperToHumidity = [];

const mapHumidityToLocation = [];

export async function day5b(dataPath?: string): Promise<number> {
  const data = await readData(dataPath, false);

  processInput(data);

  for (const data of DATA) {
    matchSeedToSoil(data);
  }
  for (const data of DATA) {
    matchSoilToFertil(data);
  }
  for (const data of DATA) {
    matchFertilToWater(data);
  }
  for (const data of DATA) {
    matchWaterToLight(data);
  }
  for (const data of DATA) {
    matchLightToTemper(data);
  }
  for (const data of DATA) {
    matchTemperToHumidity(data);
  }
  for (const data of DATA) {
    matchHumidityToLocation(data);
  }

  let best = DATA[0].location;

  for (const data of DATA) {
    if (data.location < best) {
      best = data.location;
    }
  }

  return best;
}

const processInput = (input: string) => {
  const parts = input.split('\n\n');

  const stringSeeds = parts.shift().split(':').pop().trim().split(' ');

  const stringSeedToSoil = parts.shift().split(':').pop().trim().split('\n');

  const stringSoilToFertil = parts.shift().split(':').pop().trim().split('\n');

  const stringFertilToWater = parts.shift().split(':').pop().trim().split('\n');

  const stringWaterToLight = parts.shift().split(':').pop().trim().split('\n');

  const stringLightToTemper = parts.shift().split(':').pop().trim().split('\n');

  const stringTemperToHumidity = parts
    .shift()
    .split(':')
    .pop()
    .trim()
    .split('\n');

  const stringUmidityToLocation = parts
    .shift()
    .split(':')
    .pop()
    .trim()
    .split('\n');

  for (const token of stringSeeds) {
    DATA.push(createSeed(token));
  }

  fillMap(mapSeedToSoil, stringSeedToSoil);

  fillMap(mapSoilToFertil, stringSoilToFertil);

  fillMap(mapFertilToWater, stringFertilToWater);

  fillMap(mapWaterToLight, stringWaterToLight);

  fillMap(mapLightToTemper, stringLightToTemper);

  fillMap(mapTemperToHumidity, stringTemperToHumidity);

  fillMap(mapHumidityToLocation, stringUmidityToLocation);

  console.log('mapSeedToSoil', mapSeedToSoil);
};

function createSeed(token: string) {
  return {
    seed: parseInt(token),
    soil: 0,
    fertil: 0,
    water: 0,
    light: 0,
    temper: 0,
    humidity: 0,
    location: 0,
  };
}

function fillMap(map: any[], lines: string[]) {
  for (const line of lines) {
    const tokens = line.trim().split(' ');

    const register = [];

    for (const token of tokens) {
      register.push(parseInt(token));
    }

    map.push(register);
  }
}

function findMatch(target: number, map: any[]) {
  for (const line of map) {
    const firstDestiny = line[0];
    const firstSource = line[1];
    const range = line[2];

    const lastSource = firstSource + range - 1;

    if (target < firstSource) {
      continue;
    }

    if (target > lastSource) {
      continue;
    }

    const delta = firstDestiny - firstSource;

    return target + delta;
  }

  return target;
}

function matchSeedToSoil(data: { [x: string]: any; seed: any }) {
  data['soil'] = findMatch(data.seed, mapSeedToSoil);
}

function matchSoilToFertil(data: { [x: string]: any; soil: any }) {
  data['fertil'] = findMatch(data.soil, mapSoilToFertil);
}

function matchFertilToWater(data: { [x: string]: any; fertil: any }) {
  data['water'] = findMatch(data.fertil, mapFertilToWater);
}

function matchWaterToLight(data: { [x: string]: any; water: any }) {
  data['light'] = findMatch(data.water, mapWaterToLight);
}

function matchLightToTemper(data: { [x: string]: any; light: any }) {
  data['temper'] = findMatch(data.light, mapLightToTemper);
}

function matchTemperToHumidity(data: { [x: string]: any; temper: any }) {
  data['humidity'] = findMatch(data.temper, mapTemperToHumidity);
}

function matchHumidityToLocation(data: { [x: string]: any; humidity: any }) {
  data['location'] = findMatch(data.humidity, mapHumidityToLocation);
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
