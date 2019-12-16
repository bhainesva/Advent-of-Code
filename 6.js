import R from 'ramda';
import {promises as fs} from 'fs';

const parseFile = R.compose(
  R.map(R.split(')')),
  R.split('\n'),
  String
);

const countOrbits = (tree, name, target) => {
  let count = 0;
  let cur = name;
  while (tree[cur] != target) {
    if (tree[cur] == null) return 135819385;
    cur = tree[cur];
    count += 1;
  }

  return count;
}



const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const test = `COM)B
  B)C
  C)D
  D)E
  E)F
  B)G
  G)H
  D)I
  E)J
  J)K
  K)L
  K)YOU
  I)SAN`
  const parsed = parseFile(input);

  const tree = {'COM': null};

  for (const pair of parsed) {
    if (!pair[0] || !pair[1]) continue;
    tree[pair[1].trim()] = pair[0].trim();
  }

  let minsum = 0;
  for (const name of Object.keys(tree)) {
    let minSan = Math.min(countOrbits(tree, name, 'SAN'), countOrbits(tree, 'SAN', name));
    let minYou = Math.min(countOrbits(tree, name, 'YOU'), countOrbits(tree, 'YOU', name));
    minsum = minsum == 0 ? minSan + minYou : Math.min(minsum, minSan + minYou);
  }
  console.log(minsum);

}

run();