import { load } from "./helpers.js";
import R from 'ramda';

const run = (arr) => {
	const g = new Map();
	for (const row of arr) { 
		const [s, e] = row.split('-')
		if (!g.has(s)) g.set(s, [])
		if (!g.has(e)) g.set(e, [])
		g.get(s).push(e);
		g.get(e).push(s);
	}

	console.log(g);
	dfs(g);
}

const dfs = (g) => {
	const s = 'start';
	let count = 0;

	const d = (s, path) => {
		// console.log("Visiting: ", path, s)
		if (s === 'end') {
			count++;
			return;
		}
		if (s === s.toLowerCase() && path.includes(s)) {
			return;
		}
		for (const t of g.get(s) || []) {
			d(t, [...path, s]);
		}
	}
	d(s,[])
	console.log(count);
}

load("12.txt")
	.then(run)