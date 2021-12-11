import { load } from "./helpers.js";
import R from 'ramda'

const addPoints = R.curry((a, b) => [a[0] + b[0], a[1] + b[1]]);
const boundsCheck = R.curry((grid, [r, c]) => r >= 0 && c >= 0 && r < grid.length && c < grid[0].length);

const neighbs = grid => R.compose(
	R.filter(boundsCheck(grid)),
	R.flip(R.map)([[-1,0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]),
	addPoints
)

const run = (arr) => {
	let ns = arr.map(x => x.split("").map(Number))
	let count = 0;
	for (let step = 0; step < 100; step++) {
		ns = R.map(R.map(R.add(1)))(ns);

		let flashes = new Set();
		let flashed = true;
		while (flashed == true) {
			flashed = false;
			for (let c = 0; c < ns.length; c++) {
				for (let r = 0; r < ns[0].length; r++) {
					if (ns[r][c] > 9) {
						if (flashes.has(`${r},${c}`)) continue;
						flashes.add(`${r},${c}`);
						count++;
						flashed = true;
						const nei = neighbs(ns)([r, c]);
						for (const n of nei) {
							ns[n[0]][n[1]] = ns[n[0]][n[1]] + 1;
						}
					}
				}
			}
		}

		for (const f of flashes) {
			const [r, c] = f.split(",").map(Number);
			ns[r][c] = 0;
		}
	}

	console.log(count);
}

load("11.txt")
	.then(run)