import R from 'ramda';
import {promises as fs} from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split(','),
  String
);

const modifyInitialState = R.compose(
  R.update(2, 2),
  R.update(1, 12)
);

const input = fs.readFile('/Users/bhaines/Downloads/input.txt')
  .then(parseFile);


const funcByOp = (op) => {
  if (op == 1) {
    return (a, b) => a + b;
  }
  return (a, b) => a * b;
}

const runIndex = (program, index) => {
  const op = program[index];
  const arg1 = program[program[index + 1]];
  const arg2 = program[program[index + 2]];
  const dest = program[index + 3];

  program[dest] = funcByOp(op)(arg1, arg2);
  return program;
}

const run = (program) => {
  let ind = 0;
  while (ind <= program.length) {
    if (program[ind] == 99) return program;
    program = runIndex(program, ind)
    ind += 4;
  }

  return program;
}

input
  .then(modifyInitialState)
  .then(run)
  .then(console.log);