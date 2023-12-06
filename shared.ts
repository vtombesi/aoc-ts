import { readFile } from 'fs/promises';

export async function readData(path?: string, split: boolean = true) {
  const fileName = path || process.argv[2];
  let data: any = (await readFile(fileName)).toString();
  if (split) {
    data = data.split('\n');
  }
  return data;
}
