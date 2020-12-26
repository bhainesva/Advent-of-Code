import { load } from './helpers.js'
import R from 'ramda';

const dirs = ['e', 'se', 'sw', 'w', 'nw', 'ne']

const step = ([x,y], dir) => {
  if (dir === 'e') return [x + 2, y]
  if (dir === 'se') return [x + 1, y - 1]
  if (dir === 'sw') return [x - 1, y - 1]
  if (dir === 'w') return [x - 2, y]
  if (dir === 'nw') return [x - 1, y + 1]
  if (dir === 'ne') return [x + 1, y + 1]
}

const finalTile = steps => {
  console.log("steps: ", steps);
  return R.reduce(step, [0, 0], steps)
}

const keyToStr = ([x, y]) => `${x},${y}`;

const parseRow = row => {
  const out = [];
  while (row.length) {
    for (const dir of dirs) {
      if (row.indexOf(dir) === 0) {
        row = row.replace(dir, '')
        out.push(dir)
      }
    }
  }

  return out;
}

async function main() {
  const rows = await load('24.txt')
    .then(R.map(parseRow))
    .then(R.map(finalTile))
    .then(R.map(keyToStr))

  const blacks = new Set()
  for (const tile of rows) {
    if (blacks.has(tile)) {
      blacks.delete(tile)
    } else {
      blacks.add(tile)
    }
  }

  console.log(blacks.size)
}

main();
