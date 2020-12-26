import { l, load } from './helpers.js';
import R from 'ramda';

function ocNeighbors(grid, r, c) {
  const directions = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];

  let count = 0;
  for (const [dr, dc] of directions) {
    let newr = r + dr;
    let newc = c + dc;
    while (!(newr < 0 || newr >= grid.length) && !(newc < 0 || newc >= grid[0].length)) {
      if (grid[newr][newc] == '#') {
        count += 1;
        break;
      }
      if (grid[newr][newc] == 'L') {
        break;
      }
      newr = newr + dr;
      newc = newc + dc;
    }
  }

  return count;
}

function totalOcc(grid) {
  let count = 0;
  for (const row of grid) {
    for (const seat of row) {
      if (seat === '#') count += 1;
    }
  }

  return count;
}

function eq(g1, g2) {
  for (let r = 0; r < g1.length; r++) {
    for (let c = 0; c < g1[0].length; c++) {
      if (g1[r][c] !== g2[r][c]) return false;
    }
  }

  return true;
}



function step(grid) {
  const n = [];

  for (let i = 0; i < grid.length; i++) {
      n[i] = grid[i].slice();
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const neighborCount = ocNeighbors(grid, r, c);
      if (grid[r][c] === 'L' && neighborCount === 0) {
        n[r][c] = '#';
      } else if (grid[r][c] === '#' && neighborCount >= 5) {
        n[r][c] = 'L';
      }
    }
  }

  return n;
}

async function main() {
  let rows = await load('11.txt')
    .then(R.map(R.split('')))

  let done = false;
  while (!done) {
    const next = step(rows);
    done = eq(next, rows);
    rows = next;
  }

  console.log(totalOcc(rows))
}

main();
