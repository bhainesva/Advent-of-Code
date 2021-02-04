import R from 'ramda';
import { promises as fs } from 'fs';

const getPatternForPos = (p) => {
  const out = [];

  for (const el of inp) {
    for (let i = 0; i < p; i++) {
      out.push(el);
    }
  }

  return out;
}

const fft = (ns) => {
  const pattern = [0, 1, 0, -1];
  for (let pos=0;pos<ns.length;pos++) {
    let curPatternIndex = 0;
    let j = 0;
    while (j < ns.length) {
      let curPatternVal = pattern[curPatternIndex];
      if (curPatternVal == 0) {
        j + pos;
      }
      tot += ns[j] * pattern[j];
    }
    out.push(getTens(tot));
  }
  return out;
}

const getTens = (n) => {
  const x = Math.abs(n % 10);
  return x
}

const expandForLength = (p, n) => {
  const out = [];
  let i = 0;
  while (out.length < n+1) {
    if (i == p.length) i = 0;
    out.push(p[i]);
    i++;
  }

  return out;
}


const parseFile = R.compose(
  R.map(Number),
  R.split(''),
  String
);

const makeRepeated = (arr, repeats) =>
  [].concat(...Array.from({ length: repeats }, () => arr));

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  let parsed = parseFile(input)
  parsed.pop();
  console.log("plen: ", parsed.length);

  const offset = Number(parsed.slice(0, 7).join(''));
  console.log("offset", offset);


  // parsed = '80871224585914546619083218645595'.split('').map(Number);
  parsed = makeRepeated(parsed, 2);

  for (let i=0; i<100; i++) {
    console.log("i", i);
    parsed = fft(parsed);
    console.log(parsed.join(''));
  }
}

run();