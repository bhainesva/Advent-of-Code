import R from 'ramda';
import { promises as fs } from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split(''),
  String
);

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  let parsed = parseFile(input);
  parsed = parsed.slice(0, parsed.length-1);

  let chunks = chunk(150, parsed);

  let out = [...Array(150).keys()].map((x) => -1);
  // console.log(out);
  for (const x of [...Array(150)].keys()) {
    for (const l of chunks) {
      if (out[x] !== -1 || l[x] == 2) {
        continue;
      } else {
        // console.log("x:", x);
        // console.log(l);

        // console.log(l[x]);
        out[x] = l[x];
      }
    }
  }

  const ooo = chunk(25, out);
  console.log(ooo);

  let s = '';
  for (const a of ooo) {
    for (const b of a) {
      s += b;
    }
    s += '\n';
  }
  console.log(s);
}

const min0 = (chunks) => {
  let m = 252;
  let layer = [];

  for (const l of chunks) {
    let zeros = l.filter((x) => x === 0)
    if (zeros.length < m) {
      m = zeros.length;
      layer = l;
    }
  }

  return layer
}

const chunk = (n, arr) => {
  let chunks = [];
  for (let i=0; i < arr.length; i+=n) {
      let temparray = arr.slice(i,i+n);
      chunks.push(temparray);
  }
  return chunks;
}

run();