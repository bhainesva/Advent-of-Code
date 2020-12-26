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

const rotateArr2 = matrix => {
  return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
}

const merge = tiles => {
    const squareWidth = Math.sqrt(tiles.length)
    const out = [];
    for (let i = 0; i <= tiles.length - squareWidth; i+=squareWidth) {
      const active = tiles.slice(i, i+squareWidth)
      for (let row = 0; row < tiles[i].length; row++) {
        out.push(active.map(tile => tile[row]).flat().join(''))
      }
      // out.push(R.repeat('-', squareWidth * tiles[0].length + squareWidth-1).join(''))
    }
    return out;
  }

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

const checkForMonsters = (m) => {
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[0].length; c++) {
      if (hasSeamonster(m, r, c)) {
        markMonster(m, r, c)
      }
    }
  }
  return m;
}

const doit = (m) => {
  checkForMonsters(m);
  m = rotateArr2(m);
  checkForMonsters(m);
  m = rotateArr2(m);
  checkForMonsters(m);
  m = rotateArr2(m);
  checkForMonsters(m);
  m = rotateArr2(m);
  m = m.map(R.reverse)
  checkForMonsters(m);
  m = rotateArr2(m);
  checkForMonsters(m);
  m = rotateArr2(m);
  checkForMonsters(m);
  m = rotateArr2(m);
  checkForMonsters(m);
  let count = 0;
  console.log("counting: ", m.map(R.join('')))
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m[0].length; c++) {
      if (m[r][c] === '#') count += 1
    }
  }
  return count;
}

const stripBorders = tile => {
  tile = tile.slice(1);
  tile = tile.slice(0, tile.length - 1)
  tile = tile.map(x => x.substring(1))
  tile = tile.map(x => x.substring(0, x.length-1))
  return tile;
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

  let finalOrder = [];
  function dfsHelper(tile, visited, order) {
    if (tile) {
      visited.add(realID(tile))
    }
    if (order.length > maxLen) {
      maxLen = order.length;
    }
    if (order.length === NUM_TILES * NUM_TILES) {
      const nums = order.map(realID).map(Number)
      finalOrder = order
      return
    }

    for (const [node, edges] of tiles.entries()) {
      if (tile === null) {
        const found = dfsHelper(node, new Set(visited), [...order, node])
        if (found) {
          return order;
        }
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
        if (found) {
          return order;
        }
      }
    }
  }

  dfsHelper(null, new Set(), [])
  return finalOrder;
}

const seamonsterFrom = (r, c) => {
  return [[r+1,c], [r+2,c+1], [r+2, c+4], [r+1,c+5],[r+1,c+6],[r+2,c+7],[r+2,c+10], [r+1, c+11], [r+1,c+12],[r+2,c+13],[r+2,c+16], [r+1,c+17], [r,c+18],[r+1,c+18],[r+1,c+19]]
}

const hasSeamonster = (m, r, c) => {
  if (r + 2 >= m.length || c + 16 >= m[0].length) {
    return false
  }
  for (const [newr, newc] of seamonsterFrom(r, c)) {
    if (m[newr][newc] === '.') {
      return false;
    }
  }
  return true;
}

const markMonster = (m, r, c) => {
  for (const [newr, newc] of seamonsterFrom(r, c)) {
    m[newr][newc] = 'O'
  }
}

async function main() {
  const tiles = await load('21.txt', '\n\n')
    .then(R.map(parseTile))

  const allTiles = tiles.flatMap(getTileFlippings)
  const hydratedTiles = allTiles.map(tile => ({...tile, borders: getBorders(tile)}))
  const tilesByID = new Map();
  for (const tile of hydratedTiles) {
    tilesByID.set(tile.id, tile)
  }

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

  const order = dfs(graph);
  const orderedTiles = order.map(id => tilesByID.get(id).tile)
  const borderless = orderedTiles.map(stripBorders)
  const combined = merge(borderless).map(x => x.split(''))
  console.log(doit(combined));
}

main();