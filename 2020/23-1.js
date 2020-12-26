import { l, load } from './helpers.js';
import R from 'ramda';

const splice3 = (arr, i) => {
  if (i === arr.length - 1) {
    const out = arr.splice(i, 1)
    const two = arr.splice(0, 2)
    return [...out, ...two]
  } else if (i === arr.length - 2) {
    const out = arr.splice(i, 2)
    const two = arr.splice(0, 1)
    return [...out, ...two]
  }
  return arr.splice(i, 3)
}

const step = (cups, prev) => {
  const i = (cups.indexOf(prev) + 1) % 9;
  if (i === 8) console.log("HeREEEEE")
  const cur = cups[i];
  console.log("cups: ", cups.join(' '), `(${cur})`);
  const toMove = splice3(cups, (i+1)%9);
  console.log("pick up: ", toMove);
  let target = cur - 1;
  if (target == 0) target = 9;
  let found = -1;
  while (found === -1) {
    // console.log("looking for: ", target);
    found = cups.indexOf(target)
    if (found !== -1) {
      break;
    }
    target -= 1;
    if (target == cur) {
      target -= 1;
    }
    if (target <= 0) {
      target += 9;
    }
    if (target == cur) {
      target -= 1;
    }
  }
  console.log("destination: ", target);
  console.log();
  // const out = [...cups.slice(0, found+1), ...cups.slice(found + 1)]
  // for (const m of toMove) {
  //   if (out.length )
  // }
  return [[...cups.slice(0, found+1), ...toMove, ...cups.slice(found+1)], cur]
}

async function main() {
  let input = [5,8,6,4,3,9,1,7,2]
  // let input = [3,8,9,1,2,5,4,6,7]
  let prev = 2;
  for (let i = 0; i < 100; i++) {
    console.log(`--- MOVE ${i+1} ---`);
    let [cups, cur] = step(input, prev);
    input = cups
    prev = cur;
  }
  // console.log(input.join(""));
  const iof1 = input.indexOf(1);
  console.log([...input.slice(iof1+1), ...input.slice(0, iof1)].join(''))
  // console.log(step(input, 0))

  // console.log(cmds)
}

main();
