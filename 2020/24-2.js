import { load } from './helpers.js'
import R from 'ramda';

const dirs = ['e', 'se', 'sw', 'w', 'nw', 'ne']

const neighbors = [[-1,1], [-1,-1], [-2,0], [2,0], [1,1], [1, -1]]

const getNeighbors = ([x, y]) => {
  let out = [];
  for (const [dx, dy] of neighbors) {
    out.push([x + dx, y + dy])
  }

  return out;
}

const day = (blacks) => {
  const newSet = new Set();
  const countMap = new Map();
  for (const coordStr of blacks) {
    const ns = getNeighbors(strToCoord(coordStr))
    const alivens = ns.filter(x => blacks.has(coordToStr(x)))
    if (alivens.length !== 0 && alivens.length <= 2) {
      newSet.add(coordStr);
    }
    for (const n of ns) {
      if (!countMap.has(coordToStr(n))) {
        countMap.set(coordToStr(n), 1)
      } else {
        countMap.set(coordToStr(n), countMap.get(coordToStr(n)) + 1)
      }
    }
  }

  for (const [tile, count] of countMap.entries()) {
    if (!blacks.has(tile)) {
      if (count === 2) {
        // console.log("adding white tile");
        newSet.add(tile)
      }
    }
  }

  return newSet;
}

const step = ([x,y], dir) => {
  if (dir === 'e') return [x + 2, y]
  if (dir === 'se') return [x + 1, y - 1]
  if (dir === 'sw') return [x - 1, y - 1]
  if (dir === 'w') return [x - 2, y]
  if (dir === 'nw') return [x - 1, y + 1]
  if (dir === 'ne') return [x + 1, y + 1]
}

const finalTile = steps => {
  return R.reduce(step, [0, 0], steps)
}

const coordToStr = ([x, y]) => `${x},${y}`;
const strToCoord = uu => {
  const [x, y] = uu.split(',').map(Number)
  return [x,y]
}
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
    .then(R.map(coordToStr))

  let blacks = new Set()
  for (const tile of rows) {
    if (blacks.has(tile)) {
      blacks.delete(tile)
    } else {
      blacks.add(tile)
    }
  }

  for (let d = 0; d < 100; d++) {
    // console.log("Day: ", d, blacks.size)
    blacks = day(blacks)
  }
  console.log(blacks.size);
}

main();
