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

const basinSize = (grid, r, c) => {
	const seen = new Set();
	const dfs = (r, c, prev) => {
		if (seen.has(`${r},${c}`)) return;
		if (r < 0 || r >= grid.length) return;
		if (c < 0 || c >= grid[0].length) return;
		if (grid[r][c] === 9) return;
		if (grid[r][c] < prev) return;
		seen.add(`${r},${c}`);
		const cur = grid[r][c];
		dfs(r+1, c, cur)
		dfs(r-1, c, cur)
		dfs(r, c+1, cur)
		dfs(r, c-1, cur)
	}
	dfs(r, c, -1);
	console.log(seen);
	return seen.size;
}

const run = (arr) => {
	const m = [];
	for (const r of arr) {
		m.push(r.split("").map(Number))
	}

	let out = [];
	const cc = [];
	for (let r = 0; r < m.length; r++) {
		for (let c = 0; c < m[0].length; c++) {
			const ns = neighbs(m, r, c);
			const val = m[r][c];
			if (val < Math.min(...ns)) {
				out.push(val);
				cc.push([r, c]);
			}
		}
	}

	let sizes = [];
	for (const basin of cc) {
		console.log("checking: ", basin);
		sizes.push(basinSize(m, basin[0], basin[1]))
	}
	sizes.sort((a, b) => a - b);
	sizes.reverse();
	console.log(sizes);
}

load("9.txt")
	.then(run)