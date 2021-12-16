import { load } from "./helpers.js";
import R from 'ramda';

const addPoints = R.curry((a, b) => [a[0] + b[0], a[1] + b[1]]);
const boundsCheck = R.curry((grid, [r, c]) => r >= 0 && c >= 0 && r < grid.length && c < grid[0].length);

const neighbs = grid => R.compose(
	R.filter(boundsCheck(grid)),
	R.flip(R.map)([[-1,0], [1, 0], [0, -1], [0, 1]]),
	addPoints
)

const k = pt => `${pt[0]},${pt[1]}`;

const getOr = dist => key => dist.has(key) ? dist.get(key) : Infinity;

const minNode = (q, dist) => {
	let min = 0;
	let mpt = null;
	for (const pt of q) {
		if (mpt === null || (dist.get(k(pt)) || Infinity) < min) {
			min = dist.get(k(pt)) || Infinity
			mpt = pt;
		}
	}

	return mpt;
}

const run = (arr) => {
	const g = arr.map(r => r.split("").map(Number))

	const dist = new Map();
	const get = getOr(dist);
	const q = new Set();
	for (let r = 0; r < g.length; r++) {
		for (let c = 0; c < g[0].length; c++) {
			q.add([r, c])
		}
	}
	dist.set(k([0, 0]), 0)
	while (q.size) {
		const cur = minNode(q, dist);
		const ns = neighbs(g)(cur);
		// console.log("Looking at: ", cur, get(k(cur)))
		q.delete(cur);
		console.log(q.size);

		for (const n of ns) {
			// console.log("Neighbor: ", n)
			const alt = (get(k(cur))) + g[n[0]][n[1]];
			// console.log("CURDIST: ", get(k(cur)))
			// console.log("GRID WEIGHT: ", g[n[0]][n[1]]);
			// console.log("ALT: ", alt)
			// , g[n[0]][n[1]], dist.get(k(cur)))
			if (alt < get(k(n))) {
				dist.set(k(n), alt)
			}
		}
	}

	console.log(dist);
	console.log(get(k([g.length-1, g.length-1])))
}

load("15.txt")
	.then(run)