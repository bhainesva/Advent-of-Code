import { l, load, product, applyEach } from '../helpers.js';
import { traverse } from './3.js';
import R from 'ramda';

const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
const traversers = R.map(traverse, slopes);

load('input.txt')
  .then(R.map(R.split('')))
  .then(applyEach(traversers))
  .then(R.map(R.prop('count')))
  .then(product)
  .then(l);