import R from 'ramda';
import { promises as fs, stat } from 'fs';
import readline from 'readline';

const parseFile = R.compose(
  R.map(R.split('')),
  R.split('\n'),
  String
);

const run = async () => {
  const input = await fs.readFile('help.txt');
  const parsed = parseFile(input);
  console.log(parsed);
  print(parsed);

  let tot = 0;
  for (let y = 1;y< parsed.length-1;y++) {
    for (let x = 1;x< parsed[0].length-1;x++) {
      if (parsed[y][x]=='#' &&
          parsed[y][x-1] == '#' &&
          parsed[y][x+1] == '#' &&
          parsed[y-1][x] == '#' &&
          parsed[y+1][x] == '#') {
        parsed[y][x] = '0';
        tot += (x*y);
      }
    }
  }

  print(parsed);
  console.log(tot);
}

const print = (screen) => {
  for (const row of screen) {
    console.log(row.join(''))
  }
}

run();