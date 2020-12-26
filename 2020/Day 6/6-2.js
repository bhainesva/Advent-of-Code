import { l, load, reduceDefault } from '../helpers.js';
import R from 'ramda';

const process = R.pipe(R.split('\n'), reduceDefault(R.intersection), R.length)

load('6.txt', '\n\n')
  .then(R.map(process))
  .then(R.sum)
  .then(l);