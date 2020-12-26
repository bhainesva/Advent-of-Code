import { l, load } from '../helpers.js';
import R from 'ramda';

async function main() {
  const rows = await load('1.txt')
    .then(R.map(x => Number(x)))

  const seen = new Set([0]);
  let freq = 0;
  let i = 0;
  while (true) {
    const num = rows[i];
    i += 1;
    if (i == rows.length) i = 0;
    freq += num;
    if (seen.has(freq)) {
      console.log(freq);
      return;
    }
    seen.add(freq);
  }
}

main();
