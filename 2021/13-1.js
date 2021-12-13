import { load } from "./helpers.js";

const create = (r, c) => {
	let m = [];
	for (let i=0; i < r; i++) {
		m.push(new Array(c))
	}
	return m
}

const copy = (m, source) => {
	for (let r = 0; r < m.length; r++) {
		for (let c = 0; c < m[0].length; c++) {
			m[r][c] = source[r][c];
		}
	}
}

const run = (arr) => {
	const [pts, folds] = arr;
	let maxx = 0;
	let maxy = 0;
	for (const pt of pts.split("\n")) {
		const [x, y] = pt.split(",").map(Number)
		maxx = Math.max(x, maxx)
		maxy = Math.max(y, maxy)
	}

	let m = [];
	for (let r=0; r <= maxy; r++) {
		m.push(new Array(maxx + 1))
	}

	for (const pt of pts.split("\n")) {
		const [x, y] = pt.split(",").map(Number)
		m[y][x] = '#';
	}

	let neww = [];
	for (const fold of folds.split("\n")) {
		let f = fold.replace('fold along ', '')
		let [axis, val] = f.split("=")

		if (axis == 'y') {
			neww = create((m.length - 1 - (m.length - Number(val))), m[0].length)
			copy(neww, m);
			for (let r = Number(val) + 1; r < m.length; r++) {
				for (let c = 0; c < m[0].length; c++) {
					if (m[r][c] === '#') {
						neww[Number(val) - (r - Number(val))][c] = '#'
					}
				}
			}
		}

		if (axis == 'x') {
			neww = create(m.length, (m[0].length - 1 - (m[0].length - Number(val))))
			copy(neww, m);
			for (let r = 0; r < m.length; r++) {
				for (let c = Number(val) + 1; c < m[0].length; c++) {
					if (m[r][c] === '#') {
						neww[r][Number(val) - (c - Number(val))] = '#'
					}
				}
			}
		}
		break
	}

	let count = 0;
	for (let r = 0; r < neww.length; r++) {
		for (let c = 0; c < neww[0].length; c++) {
			if (neww[r][c] === '#') {
				count++
			}
		}
	}

	console.log(count);
}

load("13.txt", '\n\n')
	.then(run)