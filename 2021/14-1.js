import { load } from "./helpers.js";
import R, { has } from 'ramda';

const run = (arr) => {
	const [base, rules] = arr;
	console.log(base);
	const rs = rules.split("\n")
	const m = new Map();
	for (const r of rs) {
		const [pair, insert] = r.split(" -> ");
		m.set(pair, insert);
	}

	let cur = base;
	for (let step = 0; step < 10; step++) {
		console.log("step: ", step);
		let out = '';
		for (let i = 0; i < cur.length - 1; i++) {
			const pair = cur.substring(i, i+2);
			// console.log("Looking at pair: ", pair)
			if (m.has(pair)) {
				out = `${out}${pair[0]}${m.get(pair)}`;
			} else {
				out += pair[0];
			}
		}
		cur = out + cur[cur.length - 1];
		// console.log("Step: ", step, cur)
	}
	console.log(cur)
	const counts = new Map();
	for (const char of cur) {
		if (!counts.has(char)) counts.set(char, 0);
		counts.set(char, counts.get(char) + 1);
	}

	let min = 0;
	let minc = '';
	let max = 0;
	let maxc = '';
	for (const [char, val] of counts.entries()) {
		if (val < min || minc === '') {
			minc = char;
			min = val;
		}
		if (val > max || maxc === '') {
			maxc = char;
			max = val;
		}
	}

	console.log(max - min)
}


load("14.txt", '\n\n')
	.then(run)