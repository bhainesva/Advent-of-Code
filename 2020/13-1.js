import { l, load } from './helpers.js';
import R from 'ramda';

async function main() {
  const rows = await load('13test.txt')
    .then(R.adjust(0, Number))
    .then(R.adjust(1, R.split(',')))

  const [early, busses] = rows;
  const bids = busses.filter(x => x !== 'x')
    .map(Number)
  console.log(bids);

  let bestid = 0;
  let wait = 23958238957283578938;
  for (const id of bids) {
    let sum = id;
    while (sum < early) {
      sum += id
    }
    if (sum - early < wait) {
      wait = sum - early;
      bestid = id;
    }
  }

  console.log(bestid * wait)

  console.log("Final State: ", rows);
}

main();
