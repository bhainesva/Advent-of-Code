import { l, load } from './helpers.js';
import R from 'ramda';

const play = (h1, h2, visited) => {
  const l = [...h1]
  const r = [...h2]

  while (l.length !== 0 && r.length !==0) {
    const key = `${l.join(',')}:${r.join(',')}`
    if (visited.has(key)) {
      return {winner: 'l', l, r};
    }
    visited.add(key);
    const curl = l.shift();
    const curr = r.shift();
    let winner = null;
    if (curl <= l.length && curr <= r.length) {
      const subres = play([...l].slice(0, curl), [...r].slice(0, curr), new Set())
      winner = subres.winner;
    } else {
      if (curl > curr) {
        winner = 'l'
      } else {
        winner = 'r'
      }
    }

    if (winner == 'l') {
      l.push(curl)
      l.push(curr)
    } else {
      r.push(curr)
      r.push(curl)
    }
  }
  return {winner: l.length === 0 ? 'r' : 'l', l: l, r: r}
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

  const res = play(one, two, new Set())
  console.log(res)
  console.log(score(res.l))
  console.log(score(res.r))
}

main();