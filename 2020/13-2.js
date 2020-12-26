import { l, load } from './helpers.js';
import R from 'ramda';

const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b

function valid(t, bids) {
  for (const [num, offset] of bids.entries()) {
    if ((t + offset) % num !== 0) return false;
  }
  return true;
}

async function main() {
  const busService = await load('13.txt')
    .then(R.last)
    .then(R.split(','));

  const busIds = R.reject(R.equals('x'), busService);
  const offsets = busIds.reduce((acc, cur) => (acc.set(Number(cur), busService.indexOf(cur))), new Map())
  const bad = new Set(offsets.keys());
  const initial = R.reduce(R.max, 0, offsets.keys())

  let step = initial;
  let t = -offsets.get(initial);
  while (!valid(t, offsets)) {
    t += step;
    bad.forEach(n => {
      if ((t + offsets.get(n)) % n === 0)  {
        bad.delete(n);
        step = lcm(step, n)
      }
    })
  }
  console.log(t);
}

main();
