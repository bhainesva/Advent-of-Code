import { l, load } from './helpers.js';
import R from 'ramda';

const play = (h1, h2) => {
  const l = [...h1]
  const r = [...h2]
  while (l.length !== 0 && r.length !==0) {
    const curl = l.shift();
    const curr = r.shift();
    if (curl > curr) {
      l.push(curl)
      l.push(curr)
    } else {
      r.push(curr)
      r.push(curl)
    }
  }
  return [l, r]
}

const score = (hand) => {
  let s = 0;
  for (let i = 0; i < hand.length; i++) {
    s = s + (hand.length - i) * hand[i]
  }
  return s;
}

async function main() {
  const [p1, p2] = await load('22.txt', '\n\n')

  const one = p1.split('\n').slice(1).map(Number)
  const two = p2.split('\n').slice(1).map(Number)

  const [aa, bb] = play(one, two)
  console.log(aa)
  console.log(score(aa))
  console.log(bb)
  console.log(score(bb))
}

main();