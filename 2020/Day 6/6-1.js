import { l, setOf, load } from '../helpers.js';
import R from 'ramda';

const process = R.pipe(R.replace(/\s+/g,''), setOf, R.prop('size'))

load('6.txt', '\n\n')
  .then(R.map(process))
  .then(R.sum)
  .then(l);