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


const funcByOp = R.ifElse(R.equals(1), R.always(R.add), R.always(R.multiply));

const runIndex = (program, index) => {
  const [op, arg1, arg2, dest] = R.slice(index, index+4, program);
  return R.update(dest, funcByOp(op)(program[arg1], program[arg2]), program);
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

// input
//   .then(modifyInitialState)
//   .then(run)
//   .then(console.log);

input.then((mem) => {
  for (const i of [...Array(100).keys()]) {
    for (const j of [...Array(100).keys()]) {
      mem = R.update(1, i, mem);
      mem = R.update(2, j, mem);
      const out = run(mem)[0];
      if (out == 19690720) {
        console.log("1: ", i);
        console.log("2: ", j);
        return;
      }
    }
  }
})

  // 3790689