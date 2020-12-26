import { l, load } from '../helpers.js';
import R from 'ramda';

const charMap = R.reduce((acc, letter) => ({
  ...acc,
  [letter]: acc[letter] ? acc[letter] + 1 : 1,
}), {})

const has3 = m => Object.values(m).includes(3);
const has2 = m => Object.values(m).includes(2);

async function main() {
  const rows = await load('2.txt')

  const maps = rows.map(charMap);
  const has2s = maps.map(has2).filter(R.identity).length;
  const has3s = maps.map(has3).filter(R.identity).length;

  console.log(has2s * has3s);
}

main();
