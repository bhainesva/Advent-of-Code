import { l, load } from '../helpers.js';
import { findFirstFailingNumber } from './9.js';
import R from 'ramda';

async function main() {
  load('9.txt')
    .then(R.map(Number))
    .then(findFirstFailingNumber)
    .then(l)
}

main();
