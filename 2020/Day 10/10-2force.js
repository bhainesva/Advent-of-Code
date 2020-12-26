import { l, load } from '../helpers.js';
import R from 'ramda';

const getAllSubsets =
      theArray => theArray.reduce(
        (subsets, value) => subsets.concat(
         subsets.map(set => [value,...set])
        ),
        [[]]
      );

function valid(chunk) {
  for (let i = 1; i < chunk.length; i++) {
    if (chunk[i] - chunk[i-1] > 3) return false;
  }
  return true;
}

function force(chunk, min, max) {
  let count = 0;
  for (const sub of getAllSubsets(chunk)) {
    if (valid([min, ...sub, max])) count += 1
  }
  return count;
}

async function main() {
  const rules = await load('10.txt')
    .then(R.map(x => Number(x)))

  const s = [0, ...rules.sort((a, b) => a - b)];
  const v = [...s, s[s.length-1] + 3]

  const fixed = [0];

  for (let i = 1; i < v.length; i++) {
    if ((v[i] - v[i-1]) == 3) {
      fixed.push(v[i-1])
      fixed.push(v[i])
    }
  }

  let tot = 1;
  let chunk = [];
  let lastFixed = 0;
  for (let i = 0; i < v.length; i++) {
    if (fixed.includes(v[i])) {
      if (chunk.length > 0) {
        tot *= force(chunk, lastFixed, v[i])
      }
      lastFixed = v[i];
      chunk = [];
    } else {
      chunk.push(v[i])
    }
  }

  console.log(v)
  console.log("fixed: ", fixed)
  console.log("total?: ", tot)
}

main();
