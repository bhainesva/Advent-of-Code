import { l, setOf, load, isSubset } from '../helpers.js';
import { requiredParts } from './4.js';
import R from 'ramda';

const validate = R.compose(
  isSubset(requiredParts),
  setOf,
  R.map(R.compose(R.head, R.split(':'))),
  R.split(/\s+/),
)

load('input.txt', '\n\n')
  .then(R.map(validate))
  .then(R.filter(R.identity))
  .then(R.length)
  .then(l);