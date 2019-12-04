import R from 'ramda';
import {promises as fs} from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split('\n'),
  String
);

const decBy = R.flip(R.subtract);
const divBy = R.flip(R.divide);

const input = fs.readFile('/Users/bhaines/Downloads/input.txt')
  .then(parseFile);

const calcFuel = R.compose(
  decBy(2),
  Math.floor,
  divBy(3)
);

const calcRecursiveFuel = R.compose(
  R.ifElse(
    R.gt(0),
    R.always(0),
    n => n + Math.max(0, calcRecursiveFuel(n))
  ),
  calcFuel
);

input
  .then(R.map(calcRecursiveFuel))
  .then(R.sum)
  .then(console.log);