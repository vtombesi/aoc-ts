import { readData } from '../../shared.ts';
import chalk from 'chalk';

enum Pulse {
  High = 'high',
  Low = 'low',
}

enum ModuleType {
  FlipFlop = '%',
  Conjunction = '&',
  Broadcaster = 'broadcaster',
}

enum ModuleState {
  On = 'on',
  Off = 'off',
}

interface Signal {
  from: string;
  to: string;
  pulse: Pulse;
}

interface Module {
  type: ModuleType;
  connectedModules: string[];

  onConnectModules(modules: string[]): void;
  onInput(pulse: Pulse, from?: string): Signal[];
}

class BaseModule implements Module {
  type = ModuleType.FlipFlop;
  connectedModules: string[] = [];

  constructor(public name: string) {
    this.name = name;
  }

  onInput(pulse: Pulse, from?: string | undefined): Signal[] {
    // if (pulse === Pulse.High) {
    //     highPulseSent++;
    // } else if (pulse === Pulse.Low) {
    //     lowPulseSent++;
    // }

    return [];
  }

  onConnectModules(modules: string[]): void {
    this.connectedModules = modules;
  }
}

class FlipFlop extends BaseModule {
  type = ModuleType.FlipFlop;
  state = ModuleState.Off;
  connectedModules: string[] = [];

  constructor(public name: string) {
    super(name);
  }

  onInput(pulse: Pulse, from: string): Signal[] {
    super.onInput(pulse, from);

    const outputSignals: Signal[] = [];

    if (pulse === Pulse.High) {
      return outputSignals;
    }

    if (pulse === Pulse.Low) {
      if (this.state === ModuleState.Off) {
        this.state = ModuleState.On;

        this.connectedModules.forEach((module) => {
          outputSignals.push({
            from: this.name,
            to: module,
            pulse: Pulse.High,
          });
        });
      } else if (this.state === ModuleState.On) {
        this.state = ModuleState.Off;

        this.connectedModules.forEach((module) => {
          outputSignals.push({
            from: this.name,
            to: module,
            pulse: Pulse.Low,
          });
        });
      }
    }

    return outputSignals;
  }
}

class Conjunction extends BaseModule {
  type = ModuleType.Conjunction;
  memory: Record<string, Pulse> = {};
  connectedModules: string[] = [];

  constructor(public name: string) {
    super(name);
  }

  setInputModule(module: string): void {
    // Initialize the memory for each input module
    this.memory[module] = Pulse.Low;
  }

  onInput(pulse: Pulse, from: string): Signal[] {
    super.onInput(pulse, from);

    const outputSignals: Signal[] = [];
    this.memory[from] = pulse;

    // Then, if it remembers high pulses for all inputs, it sends a low pulse;
    if (Object.values(this.memory).every((pulse) => pulse === Pulse.High)) {
      this.connectedModules.forEach((module) => {
        outputSignals.push({
          from: this.name,
          to: module,
          pulse: Pulse.Low,
        });
      });
    } else {
      this.connectedModules.forEach((module) => {
        outputSignals.push({
          from: this.name,
          to: module,
          pulse: Pulse.High,
        });
      });
    }
    return outputSignals;
  }
}

class Broadcaster extends BaseModule {
  type = ModuleType.Broadcaster;
  connectedModules: string[] = [];

  constructor(public name: string) {
    super(name);
  }

  onInput(pulse: Pulse, from: string): Signal[] {
    super.onInput(pulse, from);

    const outputSignals: Signal[] = [];
    this.connectedModules.forEach((module) => {
      outputSignals.push({
        from: this.name,
        to: module,
        pulse,
      });
    });
    return outputSignals;
  }
}

interface Configuration {
  name: string;
  type: ModuleType;
  connections: string[];
}

function readInput(input: string[]): Configuration[] {
  return input.map(parseInputLine);
}

function parseInputLine(line: string): Configuration {
  // Split the line by the -> separator
  const [module, connections] = line.split(' -> ');

  if (module === ModuleType.Broadcaster) {
    return {
      name: ModuleType.Broadcaster,
      type: ModuleType.Broadcaster,
      connections: connections.split(', '),
    };
  }

  const type = module[0] as ModuleType;
  const name = module.slice(1);

  return {
    name,
    type,
    connections: connections.split(', '),
  };
}

function lcm(numbers: number[]): number {
  return numbers.reduce((a, b) => (a * b) / gcd(a, b));
}

function gcd(a: number, b: number): number {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

export async function day20a(dataPath?: string) {
  const input = await readData(dataPath, false);

  const configurations = readInput(input.split('\n'));
  const modules: Record<string, Module> = {};
  configurations.forEach((configuration) => {
    const { name, type, connections } = configuration;

    switch (type) {
      case ModuleType.Broadcaster:
        modules[name] = new Broadcaster(name);
        break;
      case ModuleType.FlipFlop:
        modules[name] = new FlipFlop(name);
        break;
      case ModuleType.Conjunction:
        modules[name] = new Conjunction(name);
        break;
    }

    modules[name].onConnectModules(connections);
  });
  const conjunctionModules = (
    Object.values(modules).filter(
      (module) => module.type === ModuleType.Conjunction
    ) as Conjunction[]
  ).map((module) => module.name);
  configurations.forEach((configuration) => {
    configuration.connections.forEach((connection) => {
      if (conjunctionModules.includes(connection)) {
        (modules[connection] as Conjunction).setInputModule(configuration.name);
      }
    });
  });
  const signals: Signal[][] = [];
  let highPulseSent = 0;
  let lowPulseSent = 0;
  const ITERATIONS = 1000;
  for (let i = 0; i < ITERATIONS; i++) {
    const broadcaster = modules[ModuleType.Broadcaster] as Broadcaster;
    signals.push(broadcaster.onInput(Pulse.Low, 'button'));
    lowPulseSent++;

    while (signals.length > 0) {
      const currentSignals = signals.shift()!;
      const nextSignals: Signal[] = [];

      while (currentSignals.length > 0) {
        const currentSignal = currentSignals.shift()!;
        const { from, to, pulse } = currentSignal;

        const module = modules[to];
        if (module) {
          if (pulse === Pulse.High) {
            highPulseSent++;
          } else if (pulse === Pulse.Low) {
            lowPulseSent++;
          }
          const outputSignal = module.onInput(pulse, from);

          nextSignals.push(...outputSignal);
        } else {
          if (pulse === Pulse.High) {
            highPulseSent++;
          } else if (pulse === Pulse.Low) {
            lowPulseSent++;
          }
        }
      }

      if (nextSignals.length > 0) {
        signals.push(nextSignals);
      }
    }
  }
  return highPulseSent * lowPulseSent;
}

const answer = await day20a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
