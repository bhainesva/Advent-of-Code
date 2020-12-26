import { l, load } from '../helpers.js';
import { traverse } from './3.js';
import R from 'ramda';

load('input.txt')
  .then(R.map(R.split('')))
  .then(traverse([3, 1]))
  .then(R.prop('count'))
  .then(l)