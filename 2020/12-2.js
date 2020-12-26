import { load } from './helpers.js';
import R from 'ramda';

const mod = (x, n) => ((x%n)+n)%n;

function turn(state, dir, num) {
  const {wayx: x, wayy: y} = state;
  const rotations = [x, y, -x, -y];
  const idx = dir === 'L' ? -num / 90 : num / 90;

  const newx = rotations[mod(idx, 4)];
  const newy = rotations[mod(idx+1, 4)];
  return {...state, wayx: newx, wayy: newy};
}

function step(state, action) {
  const [dir, num] = action;
  if (dir === 'N') return R.evolve({wayy: R.add(num)}, state)
  if (dir === 'S') return R.evolve({wayy: R.add(-num)}, state)
  if (dir === 'E') return R.evolve({wayx: R.add(num)}, state)
  if (dir === 'W') return R.evolve({wayx: R.add(-num)}, state)
  if (dir === 'F') return R.evolve({x: R.add(num * state.wayx), y: R.add(num * state.wayy)}, state)
  if (dir === 'R' || dir === 'L') return turn(state, dir, num)
}

async function main() {
  const parse = R.pipe(R.splitAt(1), R.adjust(1, Number));
  const actions = await load('12.txt')
    .then(R.map(parse));

  const initialState = {x: 0, y: 0, wayx: 10, wayy: 1};
  const finalState = actions.reduce(step, initialState);

  console.log("Final State: ", finalState);
  console.log("Manhattan Distance: ", Math.abs(finalState.x) + Math.abs(finalState.y))
}

main();
