import R from 'ramda';
import { promises as fs } from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split(','),
  String
);

const readArgs = (state, n, modes) => {
  const args = [];
  for (const i of [...Array(n)].keys()) {
    if (i < modes.length && modes[i] === '1') {
      args.push(state.mem[state.pointer + 1 + i]);
    } else {
      args.push(state.mem[state.mem[state.pointer + 1 + i]]);
    }
  }

  return args;
}

const parseModes = (op) => {
  const m = op.substring(0, op.length - 2).split('').reverse();
  return m
}

const effectiveOp = (op) => {
  return op.substring(op.length - 2);
}

const step = (state, input, output) => {
  let op = state.mem[state.pointer];
  op = String(op).padStart(2, '0');
  // console.log("op: ", op)
  // console.log("state: ", state)

  if (effectiveOp(op) === '03') {
    const targetIdx = state.mem[state.pointer + 1];
    const value = input();
    return {
      pointer: state.pointer + 2,
      mem: R.update(targetIdx, value, state.mem),
    };
  } else if (effectiveOp(op) === '01') {
    const args = readArgs(state, 2, parseModes(op));
    console.log(args);
    return {
      pointer: state.pointer + 4,
      // mem: R.update(state.mem[state.pointer + 3], R.sum(args), state.mem),
      mem: R.update(state.mem[state.pointer + 3],
        !isNaN(args[0]) && !isNaN(args[1]) ? Number(args[0]) + Number(args[1]) : '(' + args[0] + ' + ' + args[1] + ')',
        state.mem),
    };
  } else if (effectiveOp(op) === '02') {
    const args = readArgs(state, 2, parseModes(op));
    console.log(args);
    return {
      pointer: state.pointer + 4,
      // mem: R.update(state.mem[state.pointer + 3], R.product(args), state.mem),
      mem: R.update(state.mem[state.pointer + 3],
        !isNaN(args[0]) && !isNaN(args[1]) ? Number(args[0]) * Number(args[1]) : '(' + args[0] + ')' + '(' + args[1] + ')',
         state.mem),
    };
  } else if (effectiveOp(op) === '99') {
    console.log("Finished");
    return {
      ...state,
      pointer: -1
    };
  } else if (effectiveOp(op) === '04') {
    output(state.mem[state.mem[state.pointer + 1]]);
    return {
      ...state,
      pointer: state.pointer + 2,
    };
  } else if (effectiveOp(op) === '05') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] !== 0) {
      return {
        ...state,
        pointer: args[1]
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 3,
      };
    }
  } else if (effectiveOp(op) === '06') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] === 0) {
      return {
        ...state,
        pointer: args[1],
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 3,
      };
    }
  } else if (effectiveOp(op) === '07') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] < args[1]) {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 1, state.mem),
      };
    } else {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 0, state.mem),
      };
    }
  } else if (effectiveOp(op) === '08') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] === args[1]) {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 1, state.mem),
      };
    } else {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 0, state.mem),
      };
    }
  }
}

const runProgram = (program, input, output) => {
  let state = {
    pointer: 0,
    mem: program,
  }

  while (state.pointer !== -1) {
    state = step(state, input, output);
  }

  return state;
}

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = parseFile(input);

  parsed[1] = 'x';
  parsed[2] = 'y';

  const {mem, pointer} = runProgram(parsed, () => null, () => null)
  console.log(mem[0] + ' = 19690720, 0 <= x <= 99, 0 <= y <= 99')
}

run();