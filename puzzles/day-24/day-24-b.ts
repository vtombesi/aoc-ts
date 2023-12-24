import { init } from 'z3-solver';
import { readData } from '../../shared.ts';

import chalk from 'chalk';

export const getNumbersFromString = (i: string): number[] => {
  const arr = i.match(/-?(\d+)/gm)?.map((v) => Number(v));
  if (!arr) return [];
  return arr;
};

export async function day24b(dataPath?: string) {
  const input = await readData(dataPath, false);

  const inputs = input.split('\n');

  const s1 = input.split('\n').map((v) => {
    const [coords, speed] = v.split('@');

    return {
      point: getNumbersFromString(coords),
      speed: getNumbersFromString(speed),
    };
  });

  const inputParsed = {
    points: s1,
  };

  type IF = (v: typeof inputParsed) => any;

  const second: IF = async ({ points }) => {
    // this is not a solution i created, found on reddit
    const { Context } = await init();

    const { Solver, Int, And, BitVec, Eq, GE, Real } = Context('main');

    const s = new Solver();

    const bv = (s: string) => Real.const(s);

    const x = bv('x');
    const y = bv('y');
    const z = bv('z');

    const vx = bv('vx');
    const vy = bv('vy');
    const vz = bv('vz');

    for (let i = 0; i < points.length; i++) {
      const t = bv(`t_{${i}}`);

      const p = points[i];

      s.add(GE(t, 0));
      s.add(Eq(x.add(vx.mul(t)), t.mul(p.speed[0]).add(p.point[0])));
      s.add(Eq(y.add(vy.mul(t)), t.mul(p.speed[1]).add(p.point[1])));
      s.add(Eq(z.add(vz.mul(t)), t.mul(p.speed[2]).add(p.point[2])));
    }

    const res = await s.check();

    const m = s.model();

    const xRes = m.eval(x);
    const yRes = m.eval(y);
    const zRes = m.eval(z);

    return Number(xRes.sexpr()) + Number(yRes.sexpr()) + Number(zRes.sexpr());
  };

  return await second(inputParsed);
}

const answer = await day24b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
