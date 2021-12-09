import { load } from "./helpers.js";
import R from 'ramda';

const addPoints = R.curry((a, b) => [a[0] + b[0], a[1] + b[1]]);
const getCell = R.curry((grid, [r,c]) => grid[r][c]);
const boundsCheck = R.curry((grid, [r, c]) => r >= 0 && c >= 0 && r < grid.length && c < grid[0].length);

const neighbs = grid => R.compose(
	R.map(getCell(grid)),
	R.filter(boundsCheck(grid)),
	R.flip(R.map)([[-1,0], [1, 0], [0, -1], [0, 1]]),
	addPoints
)

const run = (arr) => {
	const m = R.map(R.compose(R.map(Number), R.split("")), arr)

	let out = [];
	for (let r = 0; r < m.length; r++) {
		for (let c = 0; c < m[0].length; c++) {
			const ns = neighbs(m)([r, c]);
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