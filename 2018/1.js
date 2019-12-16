import R from 'ramda';
import {promises as fs} from 'fs';

const process = R.compose(
  R.sum,
  R.map(Number),
  R.split('\n'),
  String
);

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = process(input);
  console.log(parsed);
}

run();