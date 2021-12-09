import { load } from "./helpers.js";
import R from 'ramda';

const neighbs = (grid, r, c) => {
	const out = [];
	const dirs = [[-1,0], [1, 0], [0, -1], [0, 1]];
	for (const d of dirs) {
		const [dr, dc] = d;
		const newr = r + dr;
		const newc = c + dc;
		if (newr < 0 || newr >= grid.length) continue;
		if (newc < 0 || newc >= grid[0].length) continue;
		out.push(grid[newr][newc]);
	}
	return out;
}

const run = (arr) => {
	const m = [];
	for (const r of arr) {
		m.push(r.split("").map(Number))
	}

	let out = [];
	for (let r = 0; r < m.length; r++) {
		for (let c = 0; c < m[0].length; c++) {
			const ns = neighbs(m, r, c);
			const val = m[r][c];
			if (val < Math.min(...ns)) {
				out.push(val);
			}
		}
	}
	console.log(R.sum(R.map(x => x+1, out)));
}

load("9.txt")
	.then(run)