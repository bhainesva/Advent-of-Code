import { l, load } from '../helpers.js';
import R from 'ramda';

function recur(n) {
  if (n == 1) return 0;
  if (n == 2) return 0;
  if (n == 3) return 1;
  if (n == 4) return 3;
  return (3 * recur(n-1)) - recur(n-2) - recur(n-3) - (2 * recur(n-4))
}

function howManyWaysToPlaceHolesValidly(n) {
  const totalHolePlacements = Math.pow(2, n);
  const holePlacementsThatIncludeThreeConsecutiveHoles = recur(n);
  return totalHolePlacements - holePlacementsThatIncludeThreeConsecutiveHoles;
}

async function main() {
  const adapters = await load('10.txt')
    .then(R.map(x => Number(x)))
    .then(R.sort((a, b) => a - b))

  const v = [...adapters, adapters[adapters.length-1] + 3]

  const fixed = [0];

  for (let i = 1; i < v.length; i++) {
    if ((v[i] - v[i-1]) == 3) {
      fixed.push(v[i-1])
      fixed.push(v[i])
    }
  }

  let tot = 1;
  let chunkSize = 0;
  for (let i = 0; i < v.length; i++) {
    if (fixed.includes(v[i])) {
      if (chunkSize > 0) {
        tot *= howManyWaysToPlaceHolesValidly(chunkSize);
      }
      chunkSize = 0;
    } else {
      chunkSize += 1;
    }
  }

  console.log(v)
  console.log("fixed: ", fixed)
  console.log("total?: ", tot)
}

main();
