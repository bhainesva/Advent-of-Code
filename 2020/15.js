import { l, load } from './helpers.js';
import R from 'ramda';

function r() {
  const nums = [6,13,1,15,2,0]
  let i = 1
  const m = new Map();
  let last = null;
  while (i - 1 <= 30000000) {
    if (i % 10000 === 0) console.log("step: ", i)
    if (i - 1 < nums.length) {
      m.set(nums[i - 1], [i])
    } else {
      last = nums[nums.length-1];
      if (m.get(last).length == 1) {
        nums.push(0);
        m.set(0, [i, m.get(0)[0]]);
      } else {
        const v = m.get(last)[0] - m.get(last)[1];
        nums.push(v);
        if (m.has(v)) {
          m.set(v, [i, m.get(v)[0]])
        } else {
          m.set(v, [i])
        }
      }
    }
    i++;
  }

  console.log("last: ", last);
}
async function main() {
  r()
}

main();