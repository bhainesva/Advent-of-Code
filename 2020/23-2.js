import { l, load } from './helpers.js';
import R from 'ramda';

class FastList {
  constructor(list) {
    this.map = new Map();
    let prev = list[list.length -1];
    for (const [i, val] of list.entries()) {
      this.map.set(val, {prev: prev, next: list[(i+1) % list.length]})
      prev = val;
    }
  }

  insertAfter(x, newVal) {
    const {next} = this.map.get(x);
    this.map.get(x).next = newVal;
    this.map.set(newVal, {prev: x, next: next})
    this.map.get(next).prev = newVal;
  }

  removeThreeAfter(val) {
    const { next: one } = this.map.get(val);
    const { next: two } = this.map.get(one);
    const { next: three } = this.map.get(two);
    const { next } = this.map.get(three);
    this.map.get(val).next = next;
    this.map.get(next).prev = val;
    this.map.delete(one)
    this.map.delete(two)
    this.map.delete(three)
    return [one, two, three]
  }

  next(val) {
    return this.map.get(val).next;
  }

  has(val) {
    return this.map.has(val);
  }

  list() {
    let prev = 1
    let out = [];
    const {next} = this.map.get(prev);
    out.push(next);
    prev = next;
    while (prev !== 1) {
      const {next} = this.map.get(prev);
      out.push(next)
      prev = next;
    }
    return out;
  }
}

let move = 1;
const step = (cups, prev) => {
  // console.log(`--- MOVE ${move}----`)
  move += 1;
  const cur = cups.next(prev);
  // console.log(cups.list().join(" "), "(", cur, ")")
  const [one, two, three] = cups.removeThreeAfter(cur);
  // console.log("pick up: ", one, two, three)
  let target = cur - 1;
  while (!cups.has(target) || target === cur) {
    if (target <= 0) {
      target += 1000001
    }
    target -= 1;
  }
  // console.log("destination: ", target)
  // console.log();

  cups.insertAfter(target, one)
  cups.insertAfter(one, two)
  cups.insertAfter(two, three)

  return cur
}

async function main() {
  // let input = [3,8,9,1,2,5,4,6,7]
  let input = [5,8,6,4,3,9,1,7,2]
  for (let i=10; i <= 1000000; i++) {
    input.push(i)
  }
  const fl = new FastList(input);
  let prev = 1000000
  for (let i = 0; i < 10000000; i++) {
    let cur = step(fl, prev);
    prev = cur;
  }
  // console.log(fl);

  // console.log(fl.list().join(''))
  const n = fl.next(1)
  const nn = fl.next(n)
  console.log(n, nn)
  console.log(n * nn)
}

main();
