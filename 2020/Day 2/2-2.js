import { l, load } from '../helpers.js';
import R from 'ramda';

function test(line) {
  const [rule, pass] = line.split(':')
  const [indices, letter] = rule.split(' ');
  const [i1, i2] = indices.split('-')
    .map(Number)
    .map(i => pass[i] === letter);
  return (i1 && !i2) || (!i1 && i2);
}

load('input.txt')
  .then(R.map(test))
  .then(R.filter(R.identity))
  .then(R.length)
  .then(l);