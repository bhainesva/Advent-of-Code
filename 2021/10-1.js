import { load } from "./helpers.js";
import R from 'ramda';

const pt = (c) => {
	if (c === ")") return 3
	if (c === "]") return 57
	if (c === "}") return 1197
	if (c === ">") return 25137
	return 0;
}
const score = (line) => {
	const stack = [];
	for (const [i, c] of line.split('').entries()) {
		if (c === '(') {
			stack.push(')')
		} else if (c === '[') {
			stack.push(']')
		} else if (c === '{') {
			stack.push('}')
		} else if (c === '<') {
			stack.push('>')
		} else if (c === stack[stack.length - 1]) {
			stack.pop();
		} else {
			return {i, c}
		}
	}
	return {i: -1, c: ''}
}

const run = (arr) => {
	let tot = 0;
	for (const line of arr) {
		const s = score(line);
		tot += pt(s.c);
	}

	console.log(tot);
}

load("10.txt")
	.then(run)