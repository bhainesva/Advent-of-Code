import { l, load } from '../helpers.js';

function findSummers(nums) {
  for (const a of nums) {
    for (const b of nums) {
      for (const c of nums) {
        if (a + b + c === 2020) {
          return a * b * c
        }
      }
    }
  }
}

load('input.txt')
  .then(x=>x.map(Number))
  .then(findSummers)
  .then(l);