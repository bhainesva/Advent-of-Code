import R from 'ramda';
import {promises as fs} from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split(','),
  String
);

const getInput = () => 5;

const output = console.log;

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
  const m =  op.substring(0, op.length - 2).split('').reverse();
  return m
}

const effectiveOp = (op) => {
  return op.substring(op.length-2);
}

const step = (state) => {
  let op = state.mem[state.pointer];
  op = String(op).padStart(2, '0');

  if (effectiveOp(op) === '03') {
    const targetIdx = state.mem[state.pointer + 1];
    const value = getInput();
    state.mem[targetIdx] = value;
    state.pointer = state.pointer + 2;
  } else if (effectiveOp(op) === '01') {
    const args = readArgs(state, 2, parseModes(op));
    state.mem[state.mem[state.pointer + 3]] = R.sum(args);
    state.pointer = state.pointer + 4;
  } else if (effectiveOp(op) === '02') {
    const args = readArgs(state, 2, parseModes(op));
    state.mem[state.mem[state.pointer + 3]] = R.product(args);
    state.pointer = state.pointer + 4;
  } else if (effectiveOp(op) === '99') {
    console.log("Finished");
    state.pointer = -1;
  } else if (effectiveOp(op) === '04') {
    output(state.mem[state.mem[state.pointer + 1]]);
    state.pointer = state.pointer + 2;
  } else if (effectiveOp(op) === '05') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] !== 0) {
      state.pointer = args[1];
    } else {
      state.pointer = state.pointer + 3;
    }
  } else if (effectiveOp(op) === '06') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] === 0) {
      state.pointer = args[1];
    } else {
      state.pointer = state.pointer + 3;
    }
  } else if (effectiveOp(op) === '07') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] < args[1]) {
      state.mem[state.mem[state.pointer + 3]] = 1;
    } else {
      state.mem[state.mem[state.pointer + 3]] = 0;
    }
    state.pointer = state.pointer + 4;
  } else if (effectiveOp(op) === '08') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] === args[1]) {
      state.mem[state.mem[state.pointer + 3]] = 1;
    } else {
      state.mem[state.mem[state.pointer + 3]] = 0;
    }
    state.pointer = state.pointer + 4;
  }
}

const runProgram = (program) => {
  const state =  {
    pointer: 0,
    mem: program,
  }

  while (state.pointer !== -1) {
    step(state);
  }
}

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = parseFile(input);
  runProgram(parsed);
}

run();