import { l, load } from '../helpers.js';
import R from 'ramda';

load('1.txt')
  .then(R.map(x => Number(x)))
  .then(R.sum)
  .then(l);
