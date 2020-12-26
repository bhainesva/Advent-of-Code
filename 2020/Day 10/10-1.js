import { l, load } from '../helpers.js';
import R from 'ramda';

async function main() {
  const rules = await load('10.txt')
    .then(R.map(Number))

  const adapters = [0, ...rules.sort((a, b) => a - b), Math.max(...rules) + 3];
  const gaps = adapters.map((val, i, arr) => val - (i === 0 ? 0 : arr[i-1]))
  const counts = R.countBy(R.identity, gaps)

  console.log(counts['1'] * counts['3'])
}

main();
