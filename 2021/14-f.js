import { applyN, load } from "./helpers.js";
import R from 'ramda';

const expand = rules => pairCounts => {
	return R.reduce((m, [pair, val]) => {
		if (!rules.has(pair)) {
			return m.set(pair, val)
		}
		const insert = rules.get(pair);
		const p1 = `${pair[0]}${insert}`;
		const p2 = `${insert}${pair[1]}`;
		m.set(p1, (m.get(p1) || 0) + val)
		return m.set(p2, (m.get(p2) || 0) + val)
	}, new Map(), pairCounts)
}

const run = ([base, rs]) => {
	const rules = new Map(R.map(R.split(" -> "), R.split("\n", rs)))
	const pairs = R.range(0, base.length - 1).map(i => base.substring(i, i+2));
	const pairCounts = new Map(Object.entries(R.countBy(R.identity, pairs)));
	const finalPairCounts = applyN(expand(rules), 10)(pairCounts.entries())

	const charCounts = R.reduce((m, [pair,  count]) => {
			m.set(pair[0], (m.get(pair[0]) || 0) + count);
			return m.set(pair[1], (m.get(pair[1]) || 0) + count);
		}, 
		new Map([[base[0], 1], [base[base.length - 1], 1]]),
		finalPairCounts.entries());

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