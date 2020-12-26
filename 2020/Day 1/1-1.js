import { load, product } from '../helpers.js';
import { findSum } from './1.js';
import R from 'ramda';

load('input.txt')
  .then(R.map(Number))
  .then(findSum(2020))
  .then(product)
  .then(console.log);