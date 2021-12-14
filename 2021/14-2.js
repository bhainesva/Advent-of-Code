import { load } from "./helpers.js";
import R, { has } from 'ramda';

const run = (arr) => {
	const [base, rus] = arr;
	const rs = rus.split("\n")
	const rules = new Map();
	for (const r of rs) {
		const [pair, insert] = r.split(" -> ");
		rules.set(pair, insert);
	}

	let cur = base;
	let pairCounts = new Map();
	for (let i = 0; i < cur.length - 1; i++) {
		const pair = cur.substring(i, i+2);
		if (!pairCounts.has(pair)) pairCounts.set(pair, 0);
		pairCounts.set(pair, pairCounts.get(pair) + 1);
	}

	for (let step = 0; step < 40; step++) {
		const newPairCounts = new Map();
		for (const [pair, val] of pairCounts.entries()) {
			if (!rules.has(pair)) {
				if (!newPairCounts.has(pair)) newPairCounts.set(pair, 0)
				newPairCounts.set(pair, newPairCounts.get(pair) + val)
				continue;
			}
			const insert = rules.get(pair);
			const p1 = pair[0] + insert;
			const p2 = insert + pair[1];
			if (!newPairCounts.has(p1)) newPairCounts.set(p1, 0)
			if (!newPairCounts.has(p2)) newPairCounts.set(p2, 0)
			newPairCounts.set(p1, newPairCounts.get(p1) + val)
			newPairCounts.set(p2, newPairCounts.get(p2) + val)
		}
		pairCounts = newPairCounts
	}

	const charCounts = new Map();
	for (const [pair, count] of pairCounts.entries()) {
		if (!charCounts.has(pair[0])) charCounts.set(pair[0], 0);
		if (!charCounts.has(pair[1])) charCounts.set(pair[1], 0);
		charCounts.set(pair[0], charCounts.get(pair[0]) + count);
		charCounts.set(pair[1], charCounts.get(pair[1]) + count);
	}
	charCounts.set(base[0], charCounts.get(base[0]) + 1)
	charCounts.set(base[base.length - 1], charCounts.get(base[base.length - 1]) + 1)

	let min = 0;
	let minc = '';
	let max = 0;
	let maxc = '';
	for (const [char, val] of charCounts.entries()) {
		if (val < min || minc === '') {
			minc = char;
			min = val;
		}
		if (val > max || maxc === '') {
			maxc = char;
			max = val;
		}
	}

	console.log((max / 2) - (min / 2))
}


load("14.txt", '\n\n')
	.then(run)