import { l, load } from './helpers.js';
import R from 'ramda';

const mod = (x, n) => ((x%n)+n)%n;

function turn(cur, dir, num) {
  const facings = ["E", "S", "W", "N"];
  const steps = dir === 'L' ? -num / 90 : num / 90;
  const idx = facings.indexOf(cur);
  const newIdx = idx + steps;
  return facings[mod(newIdx, 4)]
}

function op(state, action) {
  const [dir, num] = action;
  const modifiers = {
    'N': {y: R.add(num)},
    'S': {y: R.add(-num)},
    'E': {x: R.add(num)},
    'W': {x: R.add(-num)},
  }

  if (['N', 'S', 'E', 'W'].includes(dir)) return R.evolve(modifiers[dir], state);
  if (['L', 'R'].includes(dir)) return R.evolve({facing: f => turn(f, dir, num)}, state)
  return R.evolve(modifiers[state.facing], state)
}

async function main() {
  const actions = await load('12.txt')
    .then(R.map(R.splitAt(1)))
    .then(R.map(R.adjust(1, Number)));

    const initialState = {x: 0, y: 0, facing: "E"}
    const finalState = actions.reduce(op, initialState);
    console.log("Final State: ", finalState);
    console.log("Manhattan Distance: ", Math.abs(finalState.x) + Math.abs(finalState.y))
}

main();
