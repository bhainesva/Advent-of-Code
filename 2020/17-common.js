import R from 'ramda';
import { reduceWithIndex } from './helpers.js'

const incrementCount = (map, key) => map.set(key, (map.get(key) || 0) + 1);

function step(grid) {
  const neighborCounts = R.reduce((counts, coordStr) => {
    const neighbors = getNeighbors(strToCoord(coordStr));
    return R.reduce(incrementCount, counts, neighbors.map(coordToStr));
  }, new Map(), grid.values());

  return R.reduce((newGrid, [neighbor, count]) => {
    return (grid.has(neighbor) && count === 2) || count === 3
      ? newGrid.add(neighbor)
      : newGrid
  }, new Set(), neighborCounts.entries());
}

const cartesianProduct = a => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
const applyN = R.compose(R.reduceRight(R.compose, R.identity), R.repeat);

const coordToStr  = R.join(',');
const strToCoord = R.compose(R.map(Number), R.split(','))

function getNeighbors(coord) {
  const possibilities = coord.map(x => [x-1, x, x+1])
  return R.reject(R.equals(coord), cartesianProduct(possibilities))
}

const expandToDimension = (d, coord) => R.concat(coord, R.repeat(0, d - coord.length))

export default function run(rows, dimension) {
  const input = rows.flat().join('');
  const width = rows[0].length;

  const grid = reduceWithIndex((grid, char, i) => {
    return char === '#'
    ? grid.add(expandToDimension(dimension, [Math.floor(i/width),i%width]).join(','))
    : grid
  }, new Set(), input)

  const finalGrid = applyN(step, 6)(grid)
  return Array.from(finalGrid.values()).length
}