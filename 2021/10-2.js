import { load } from "./helpers.js";
import R from 'ramda';

const pt = (c) => {
	if (c === ")") return 1
	if (c === "]") return 2
	if (c === "}") return 3
	if (c === ">") return 4
	return 0;
}

const complete = (line) => {
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
		}
	}
	console.log("s: ", stack);

	const needed = R.reverse(stack)
	let s = 0;
	for (const c of needed) {
		s *= 5;
		s += pt(c);
	}
	return s
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
	const out = [];
	for (const line of arr) {
		if (score(line).i === -1) {
			out.push(complete(line));
		}
	}

	console.log(out);
	console.log(R.median(out));
}

load("10.txt")
	.then(run)