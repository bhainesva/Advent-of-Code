import { load } from '../helpers.js';

const diffByOne = (s, t) => {
  let diffFound = false;
  for (let i = 0; i<s.length; i++) {
    if (s[i] !== t[i]) {
      if (diffFound) return false;
      diffFound = true;
    }
  }

  return diffFound;
}

async function main() {
  const rows = await load('2.txt')

  for (const s of rows) {
    for (const t of rows) {
      if (diffByOne(s, t)) {
        console.log(s, t);
        return;
      }
    }
  }
}

main();
