import { l, load } from '../helpers.js';
import { getSeatId } from './5.js'
import R from 'ramda';

load('5.txt')
  .then(R.map(getSeatId))
  .then(R.difference([...Array(987).keys()]))
  .then(remaining => remaining.filter(id => !remaining.includes(id - 1) && !remaining.includes(id + 1)))
  .then(l);