import { l, load } from './helpers.js';
import R from 'ramda';

function ocNeighbors(grid, r, c) {
  const dx = [-1, 0, 1];
  const dy = [-1, 0, 1];
  let count = 0;
  for (const x of dx) {
    for (const y of dy) {
      const newr = r + x;
      const newc = c + y;
      if (x == 0 && y == 0) continue;
      if (newr < 0 || newr >= grid.length) continue
      if (newc < 0 || newc >= grid[0].length) continue
      if (grid[newr][newc] == '#') count += 1;
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
      } else if (grid[r][c] === '#' && neighborCount >= 4) {
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
