import R from 'ramda';
import { promises as fs, stat } from 'fs';

const parseFile = R.compose(
  R.map(R.map(R.trim)),
  R.map(R.split('=>')),
  R.split('\n'),
  String
);

const toIng = (str) => {
  return R.compose(
    (arr) => ({[arr[1]]: Number(arr[0])}),
    R.split(' '),
    R.trim()
  )(str);
}

const reduceIng = (ing, amt, recipeForElm) => {
  const rec = Object.assign({}, recipeForElm[ing].rec);
  const reps = Math.ceil(amt / recipeForElm[ing].amt)
  console.log("loooking at: ", ing, amt);
  for (const i of Object.keys(rec)) {
    rec[i] = rec[i] * reps;
  }
  console.log("turned to: ", rec)

  return rec;
}

const reduce = (ings, recipeForElm) => {
  let out = {};
  for (const ing of Object.keys(ings)) {
    if (ing == "ORE") continue;
    const res = reduceIng(ing, ings[ing], recipeForElm);
    for (const k of Object.keys(res)) {
      if (out[k]) {
        out[k] += res[k];
      } else {
        out[k] = res[k];
      }
    }
  }
  return out;
}

const run = async () => {
  // const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');

  const input = `10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`
  let parsed = parseFile(input);
  parsed = parsed.slice(0,parsed.length);

  const recipeForElm = {};
  console.log(parsed);

  for (const rec of parsed) {
    const [outVol, outElm] = rec[1].trim().split(' ');
    const inp = rec[0].split(',').map(toIng) .reduce((acc, rec) => Object.assign(acc, rec), {});
    recipeForElm[outElm] = {rec: inp, amt: outVol};
  }

  let fuelRec = recipeForElm['FUEL']
  console.log("Reducing this: ", fuelRec);

  while (Object.keys(fuelRec.rec).length != 1) {
    fuelRec.rec = reduce(fuelRec.rec, recipeForElm);
    console.log("reduced: ", fuelRec);
  }
}


run();