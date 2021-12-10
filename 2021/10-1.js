import { load } from "./helpers.js";
import R from 'ramda';

const pair = {'(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<'};
const pt = {')': 3, ']': 57, '}': 1197, '>': 25137};

const red = (state, c) => {
	if (['(', '{', '[', '<'].includes(c)) return {...state, stack: [...state.stack, pair[c]]}
	if (R.last(state.stack) === c) return {...state, stack: R.init(state.stack)}
	return R.reduced({...state, invalid: pt[c]});
}

load("10.txt")
	.then(R.map(R.reduce(red, {stack: []})))
	.then(R.map(state => state.invalid || 0))
	.then(R.sum)
	.then(console.log);