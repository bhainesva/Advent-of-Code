import { l, load } from './helpers.js';
import run from './17-common.js'

async function main() {
  const rows = await load('17.txt');
  l(run(rows, 4))
}

main();