import { load } from "./helpers.js";
import R from 'ramda';

const merge = (l1, l2) => l1.map((el, i) => l2[i] === '#' ? '#' : el)
const flip = pivot => R.map(r => R.reverse(merge(R.reverse(R.slice(0, pivot, r)), R.slice(pivot+1, r.length, r))))
const orient = axis => axis === 'y' ? R.transpose : R.identity;

const run = ([pts, folds]) => {
	const ps = pts.split("\n").map(p => p.split(",").map(Number));

	const [mx, my] = R.reduce((ms, pt) => R.zipWith(R.call)(R.map(R.max, pt), ms), [0,0], ps)
	let m = [...new Array(my + 1)].map(_ => new Array(mx + 1).fill(' '))
	R.forEach(([x, y]) => m[y][x] = '#', ps)

	m = R.reduce((m, f) => {
		let [axis, val] = f.replace('fold along ', '').split("=");
		return orient(axis)(flip(Number(val))(orient(axis)(m)));
	}, m, folds.split("\n"))
	console.log(R.join("\n", R.map(R.join(''), m)))
}

load("13.txt", '\n\n')
	.then(run)