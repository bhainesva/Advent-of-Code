import { l, load } from '../helpers.js';
import { getSeatId } from './5.js'
import R from 'ramda';

load('5.txt')
  .then(R.map(getSeatId))
  .then(R.reduce(R.max, 0))
  .then(l);