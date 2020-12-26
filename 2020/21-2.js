import { l, load } from './helpers.js';
import R from 'ramda';

const parse = row => {
  const [ing, all] = row.split(" (contains ")
  let ingredients = ing.split(" ")
  let allergens = all.substring(0, all.length-1).split(', ')
  return [ingredients, allergens]
}

const prune = m => {
  let removed = true;
  const pruned = new Set();
  while (removed == true) {
    // console.log("back at the top:")
    removed = false;
    for (const [all, ings] of m.entries()) {
      if (ings.size === 1) {
        const toRemove = Array.from(ings)[0];
        if (!pruned.has(toRemove)) {
          console.log("Pruned didn't have: ", toRemove)
          removed = true;
          console.log("adding: ", toRemove);
          pruned.add(toRemove)
          for (const [a, is] of m.entries()) {
            if(is.size !== 1) m.get(a).delete(toRemove)
          }
        }
      }
    }
  }
  return m;
}

async function main() {
  const rows = await load('21.txt')
  const foods = rows.map(parse)
  const bak = [...foods]
  const possibilities = new Map();

  for (const [ing, all] of foods) {
    for (const a of all) {
      if (!possibilities.has(a)) {
        console.log("Base for ", a, ing)
        possibilities.set(a, new Set(ing))
      } else {
        console.log("Pruning for ", a)
        for (const poss of possibilities.get(a).keys()) {
          if (!ing.includes(poss)) {
            // console.log("deleting: ", poss, possibilities.get(a))
            possibilities.get(a).delete(poss);
            // console.log("after: ", possibilities.get(a))
          }
        }
      }
    }
  }

  console.log("Poss: ", possibilities)
  const prunedPossibilities = prune(possibilities)
  console.log("Poss: ", prunedPossibilities)

  const allI = new Set();
  for (const [ings, all] of bak) {
    for (const i of ings) {
      allI.add(i)
    }
  }

  const allP = new Set();
  for (const [all, ings] of prunedPossibilities.entries()) {
    for (const i of ings) {
      allP.add(i)
    }
  }
  console.log("allI", allI)
  console.log("allp: ", allP)
  const cant = R.difference(Array.from(allI), Array.from(allP))
  console.log("cant: ", cant);
  let count = 0;
  for (const [ings, all] of foods) {
    for (const i of ings) {
      if (cant.includes(i)) {
        count += 1;
      }
    }
  }

  const back = new Map();
  const ings = [];
  for (const [all, ing] of prunedPossibilities.entries()) {
    ings.push(Array.from(ing)[0]);
    back.set(Array.from(ing)[0], all)
  }

  console.log(back)
  console.log(ings.sort((a, b) => back.get(a) < back.get(b) ? -1 : 1).join(","))
}

main();