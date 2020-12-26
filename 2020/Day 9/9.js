import { findSum } from '../Day 1/1.js';
import R from 'ramda';

export const findFirstFailingNumber = R.addIndex(R.find)((num, i, list) => i >= 25 && findSum(num, list.slice(i-25, i)).length === 0)