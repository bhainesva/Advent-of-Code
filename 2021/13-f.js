import { load } from "./helpers.js";
import R from 'ramda';

const flipOver = (axis, val) => axis - (val - axis);
const row = (r, g) => g[r];
const col = (c, g) => R.map(r => r[c], g);
const merge = R.zipWith((a, b) => (a === '#' || b === '#') ? '#' : '')

const run = (arr) => {
	const [pts, folds] = arr;
	const set = R.reduce((s, pt) => [...s, pt.split(",").map(Number)], [], pts.split("\n"));

	const out = R.reduce((out, fold) => {
		let [axis, val] = fold.replace('fold along ', '').split("=");
		return R.uniq(out.map(([x, y]) => {
			const toCheck = axis === 'x' ? x : y;
			if (typeof y !== 'number') console.log("What: ", x, y)
			if (toCheck < Number(val) + 1) return [x, y]
			const ret = [
				axis === 'x' ? flipOver(Number(val), x) : x,
				axis === 'y' ? flipOver(Number(val), y) : y,
			]
			return ret;
		}))
	}, set, folds.split("\n"))

	print(out);
}

const print = (pts) => {
	const maxx = R.reduce((max, pt) => R.max(max, pt[0]), 0, pts)
	const maxy = R.reduce((max, pt) => R.max(max, pt[1]), 0, pts)

	let m = [];
	for (let r=0; r <= maxy; r++) {
		m.push(new Array(maxx + 1).fill(null))
	}

	for (const pt of pts) {
		const [x,y] = pt;
		m[y][x] = '#';
	}

	for (let r = 0; r < m.length; r++) {
		console.log((m[r] || []).map(x => x ? x : ' ').join(""))
	}
}

load("13.txt", '\n\n')
	.then(run)

const t = [
	[1,2,3],
	[4,5,6],
	[7,8,9]
]

console.log(t.map(r => r.join(" ")).join("\n"));
console.log(R.transpose(t).map(r => r.join(" ")).join("\n"));