import { l, load } from './helpers.js';
import R from 'ramda';


const transformNTimes = (subject, n) => {
  let val = 1;
  console.log("Transforming: ", subject, n, "times")
  for (let i = 0; i < n; i++) {
    val = (val * subject) % 20201227;
  }

  return val;
}

const findLoopSize = value => {
  let i = 0;
  let val = 1;
  while (value != val) {
    i++;
    val = (val * 7) % 20201227;
  }
  return i;
}

async function main() {
  const ps = await load('25.txt')
    .then(R.map(Number))

  // const ps = [5764801, 17807724]

  const ls = R.map(findLoopSize, ps)
  console.log(ls);

  console.log(transformNTimes(ps[1], ls[0]), transformNTimes(ps[0], ls[1]))
}

main();
