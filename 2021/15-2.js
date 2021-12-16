import { load } from "./helpers.js";
import Heap from "collections/heap.js";
import R from 'ramda';

const addPoints = R.curry((a, b) => [a[0] + b[0], a[1] + b[1]]);
const boundsCheck = R.curry((grid, [r, c]) => r >= 0 && c >= 0 && r < grid.length && c < grid[0].length);

const neighbs = grid => R.compose(
	R.filter(boundsCheck(grid)),
	R.flip(R.map)([[-1,0], [1, 0], [0, -1], [0, 1]]),
	addPoints
)

const inc = x => x === 9 ? 1 : x + 1;
const incR = R.map(inc);
const incG = R.map(incR);

const k = pt => `${pt[0]},${pt[1]}`;

const getOr = dist => key => dist.has(key) ? dist.get(key) : Infinity;

const run = (arr) => {
	const g1 = arr.map(r => r.split("").map(Number))
	const g2 = g1.map(r => [...r, ...incR(r), ...incR(incR(r)), ...incR(incR(incR(r))), ...incR(incR(incR(incR(r))))])
	const g = [
		...g2,
		...incG(g2),
		...incG(incG(g2)),
		...incG(incG(incG(g2))),
		...incG(incG(incG(incG(g2)))),
	]

	const dist = new Map();
	const get = getOr(dist);
	dist.set(k([0,0]), 0)
	const h = new Heap([[[0, 0], 0]], null, (a, b) => b[1] - a[1]);
	while (h.length) {
		const cur = h.pop();
		const ns = neighbs(g)(cur[0])
		for (const n of ns) {
			const left = get(k(cur[0])) + g[n[0]][n[1]] 
			if (left < get(k(n))) {
				dist.set(k(n), left)
				h.push([n, dist.get(k(n))])
			}
		}
	}

	console.log(get(k([499,499])));
}

load("15.txt")
	.then(run)