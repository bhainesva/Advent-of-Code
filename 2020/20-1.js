import { l, load } from './helpers.js';
import R from 'ramda';

const parseTile = (lines) => {
  const [meta, ...tile] = lines.split('\n');
  const pieces = meta.split(' ')
  const id = pieces[1].replace(':', '')
  return {id, tile}
}

const NUM_TILES = 12;

const applyN = R.compose(R.reduceRight(R.compose, R.identity), R.repeat);

const rotateArr = matrix => {
  matrix = matrix.map(x => x.split(''))
  matrix = matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
  return matrix.map(x => x.join(''))
}

const merge = (num => {
  return tiles => {
    const out = [];
    for (let i = 0; i <= tiles.length - num; i+=num) {
      const active = tiles.slice(i, i+num)
      for (let row = 0; row < tiles[i].length; row++) {
        out.push(active.map(tile => tile[row]).flat().join('|'))
      }
      out.push(R.repeat('-', num * tiles[0].length).join(''))
    }
    console.log(out);
  }
})(NUM_TILES)

const getTileFlippings = tileObj => {
  const {id, tile} = tileObj;
  const flipx = tile.map(R.reverse)
  return [
    {id: id + 'A', tile: tile}, // original
    {id: id + 'B', tile: rotateArr(tile)}, // rotations
    {id: id + 'C', tile: applyN(rotateArr, 2)(tile)},
    {id: id + 'D', tile: applyN(rotateArr, 3)(tile)},
    {id: id + 'E', tile: R.reverse(tile)}, // flip
    {id: id + 'F', tile: rotateArr(R.reverse(tile))}, // rotations
    {id: id + 'G', tile: applyN(rotateArr, 2)(R.reverse(tile))},
    {id: id + 'H', tile: applyN(rotateArr, 3)(R.reverse(tile))},
  ]
}

const getBorders = tile => ({
  UP: tile.tile[0],
  RIGHT: tile.tile.map(x => x[x.length-1]).join(''),
  DOWN: tile.tile[tile.tile.length-1],
  LEFT: tile.tile.map(x => x[0]).join(''),
})

const realID = id => id.substring(0, id.length-1)

function dfs(tiles) {
  console.log("dfs on: ", Array.from(tiles.keys()).length)
  let maxLen = 0;

  function dfsHelper(tile, visited, order) {
    if (tile) {
      visited.add(realID(tile))
    }
    if (order.length > maxLen) {
      maxLen = order.length;
      console.log("Found path of: ", maxLen)
    }
    if (order.length === NUM_TILES * NUM_TILES) {
      console.log(order.join(','))
      const nums = order.map(realID).map(Number)
      console.log(nums[0] * nums[11] * nums[143] * nums[132])
      return order
    }

    for (const [node, edges] of tiles.entries()) {
      if (tile === null) {
        const found = dfsHelper(node, new Set(visited), [...order, node])
        if (found) return order;
      } else {
        if (visited.has(realID(node))) {
          continue
        }
        if (order.length >= NUM_TILES) {
          if (!edges.up.has(order[order.length - NUM_TILES])) continue
          // if (node.borders.UP !== order[order.length - NUM_TILES].borders.DOWN) continue
        }
        if (order.length % NUM_TILES !== 0) {
          if (!edges.back.has(order[order.length - 1])) continue
          // if (node.borders.LEFT !== order[order.length - 1].borders.RIGHT) continue
        }
        const found = dfsHelper(node, new Set(visited), [...order, node])
        if (found) return order;
      }
    }
  }

  const guy = dfsHelper(null, new Set(), [])
  console.log("guy: ", guy)
}

async function main() {
  const tiles = await load('21.txt', '\n\n')
    .then(R.map(parseTile))

  const allTiles = tiles.flatMap(getTileFlippings)
  const hydratedTiles = allTiles.map(tile => ({...tile, borders: getBorders(tile)}))
  const graph = new Map();
  for (const source of hydratedTiles) {
    for (const dest of hydratedTiles) {
      if (!graph.has(source.id)) {
        graph.set(source.id, {
          up: new Set(),
          back: new Set(),
        })
      }
      if (source.borders.UP === dest.borders.DOWN) {
        graph.get(source.id).up.add(dest.id);
      }
      if (source.borders.LEFT === dest.borders.RIGHT) {
        graph.get(source.id).back.add(dest.id);
      }
    }
  }

  // l(graph);
  dfs(graph);
}

main();