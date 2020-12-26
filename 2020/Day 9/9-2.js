import { l, load } from '../helpers.js';
import R from 'ramda';
import { findFirstFailingNumber } from './9.js';

function findSumRange(target, nums) {
  const state = {low: 0, high: 1, sum: nums[0] + nums[1]}
  return R.until(
    state => state.sum === target,
    (state) => state.sum < target
      ? {...state, high: state.high + 1, sum: state.sum + nums[state.high + 1]}
      : {...state, low: state.low + 1, sum: state.sum - nums[state.low]}
   , state, nums)
}

async function main() {
  const rows = await load('9.txt')
    .then(R.map(Number));

  const firstFailure = findFirstFailingNumber(rows);
  const range = findSumRange(firstFailure, rows);
  const rangeNums = rows.slice(range.low, range.high)

  console.log(Math.min(...rangeNums) + Math.max(...rangeNums))
}

main();
