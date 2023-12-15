import { readData } from '../../shared.ts';
import chalk from 'chalk';

let boxes = [];
for(let i = 0; i < 256; i++) {
    boxes.push([]);
}

function calcFocusPower(boxes) {
  let sum = 0;

  for(let i = 0; i < boxes.length; i++) {
      if(boxes[i].length == 0) {
          continue;
      }
      for(let j = 0; j < boxes[i].length; j++) {
          let value = Number(boxes[i][j].split(" ")[1]);
          let focusValue = (i + 1) *(j + 1) * value;
          sum += focusValue;
      }
  }

  return sum;
}

const hashString = (s: string) => {
  const characters = s.split('');
  const result = characters.reduce((acc: number, item: string, index: number) => {
    const asciiCode = item.charCodeAt(0);

    acc += asciiCode;
    acc *= 17;
    acc = acc % 256;

    return acc;
  }, 0);
  return result;
};

export async function day15b(dataPath?: string) {
  const data = await readData(dataPath, false);

  const input = data.split(',');

  let boxes = [];
  for (let i = 0; i < 256; i++) {
    boxes.push([]);
  }

  for (let i = 0; i < input.length; i++) {
    let operationIndex = input[i].includes('-')
      ? input[i].indexOf('-')
      : input[i].indexOf('=');
    let key = input[i].substring(0, operationIndex);
    let lensValue = input[i].substring(operationIndex + 1);
    let value = `${key} ${lensValue}`;

    let box = hashString(key);
    let operation = input[i][operationIndex];

    if (operation == '-') {
      for (let i = 0; i < boxes[box].length; i++) {
        if (boxes[box][i].startsWith(key)) {
          boxes[box].splice(i, 1);
          break;
        }
      }
    } else if (operation == '=') {
      let found = false;
      for (let i = 0; i < boxes[box].length; i++) {
        if (boxes[box][i].startsWith(key)) {
          found = true;
          boxes[box][i] = value;
          break;
        }
      }

      if (!found) {
        boxes[box].push(value);
      }
    }
  }

  let totalFocusingPower = calcFocusPower(boxes);

  return totalFocusingPower;
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
