import R from 'ramda';
import { promises as fs, stat } from 'fs';
import readline from 'readline';

const parseFile = R.compose(
  R.map(Number),
  R.split(','),
  String
);

const readArgs = (state, n, modes) => {
  const args = [];
  for (const i of [...Array(n)].keys()) {
    if (i < modes.length && modes[i] === '1') {
      args.push(get(state, state.pointer + 1 + i));
    } else if (i < modes.length && modes[i] === '2') {
      args.push(get(state, state.rbase + get(state, state.pointer + 1 + i)));
    } else {
      args.push(get(state, get(state, state.pointer + 1 + i)));
    }
  }

  return args;
}

const get = (state, idx) => {
  if (idx >= state.mem.length) {
    if (state.backingMem[idx]) return state.backingMem[idx];
    state.backingMem[idx] = 0;
    return 0;
  }

  return state.mem[idx];
}

const set = (state, idx, val) => {
  if (idx >= state.mem.length) {
    state.backingMem[idx] = val;
    return state;

  }

  const newMem = R.update(idx, val, state.mem);
  return {
    ...state,
    mem: newMem,
  }
}

const parseModes = (op) => {
  const m = op.substring(0, op.length - 2).split('').reverse();
  return m
}

const effectiveOp = (op) => {
  return op.substring(op.length - 2);
}

const step = async (state, input, output) => {
  let op = state.mem[state.pointer];
  op = String(op).padStart(2, '0');

  // Input
  if (effectiveOp(op) === '03') {
    let targetIdx = state.mem[state.pointer + 1];
    if (parseModes(op)[0] == '2') {
      targetIdx += state.rbase;
    }
    const value = await input();
    return {
      ...state,
      pointer: state.pointer + 2,
      mem: set(state, targetIdx, value).mem,
    };
  } else if (effectiveOp(op) === '01') { // Sum
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    return {
      ...state,
      pointer: state.pointer + 4,
      mem: set(state, targetIdx, R.sum(args)).mem,
    };
  } else if (effectiveOp(op) === '02') { // Product
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    return {
      ...state,
      pointer: state.pointer + 4,
      mem: set(state, targetIdx, R.product(args)).mem,
    };
  } else if (effectiveOp(op) === '99') { // Exit
    console.log("Finished");
    return {
      ...state,
      pointer: -1
    };
  } else if (effectiveOp(op) === '04') { // Output
    const args = readArgs(state, 1, parseModes(op));
    output(args[0]);
    return {
      ...state,
      pointer: state.pointer + 2,
    };
  } else if (effectiveOp(op) === '05') { // Jump If True
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
  } else if (effectiveOp(op) === '06') { // Jump if False
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
  } else if (effectiveOp(op) === '07') { // less than
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    if (args[0] < args[1]) {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 1).mem,
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 0).mem,
      };
    }
  } else if (effectiveOp(op) === '08') { // Equals
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    // console.log("args: ", args);
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    if (args[0] === args[1]) {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 1).mem,
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 0).mem,
      };
    }
  } else if (effectiveOp(op) === '09') { // Adjust Rbase
    return op09(state, op);
  }
}

const op09 = (state, op) => {
  const args = readArgs(state, 1, parseModes(op));
  return {
    ...state,
    pointer: state.pointer + 2,
    rbase: state.rbase + args[0],
  }
}

const runProgram = async (program, input, output) => {
  let state = {
    pointer: 0,
    mem: program,
    rbase: 0,
    backingMem: {},
  }

  while (state.pointer !== -1) {
    state = await step(state, input, output);
    // console.log("after: ", state);
  }
}

const tile = (id) => {
  switch (id) {
    case 0:
      return ' ';
    case 1:
      return 'x';
    case 2:
      return 'B';
    case 3:
      return '+';
    case 4:
      return 'o'
  }
}

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = parseFile(input);

  runProgram(parsed, () => 1, c => process.stdout.write(String.fromCharCode(c)));
}

const print = (screen) => {
  for (const row of screen) {
    console.log(row.join(''))
  }
}

run();