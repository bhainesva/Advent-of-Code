import { l, setOf, load, isSubset, allTrue } from '../helpers.js';
import { requiredParts } from './4.js';
import R from 'ramda';

const inRange = R.curry((lower, upper, num) => lower <= Number(num) && Number(num) <= upper);
const len4 = R.compose(R.equals(4), R.length)

const fieldValidator = {
  "byr": R.allPass([len4, inRange(1920, 2002)]),
  "iyr": R.allPass([len4, inRange(2010, 2020)]),
  "eyr": R.allPass([len4, inRange(2020, 2030)]),
  "hgt": s => {
    const matches = s.match(/(\d+)(cm|in)/);
    return (!matches || matches.length !== 3)
      ? false
      : ((matches[2] === 'in' && inRange(59, 76, matches[1])) ||
        (matches[2] === 'cm' && inRange(150, 193, matches[1])))
  },
  "hcl": s => /#[0-9a-f]{6}/.test(s),
  "ecl": s => ['amb','blu','brn','gry','grn','hzl','oth'].includes(s),
  "pid": s => s.length === 9 && /\d+/.test(s),
  "cid": R.T
}

function validate(passport) {
  const parts = passport.split(/\s+/).map(R.split(':'));
  const complete = isSubset(requiredParts, setOf(parts.map(R.head)))
  const valid = parts.map(([field, val]) => fieldValidator[field](val));

  return complete && allTrue(valid);
}

load('input.txt', '\n\n')
  .then(R.map(validate))
  .then(R.filter(R.identity))
  .then(R.length)
  .then(l);