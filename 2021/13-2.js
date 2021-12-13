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

	let prev = JSON.parse(JSON.stringify(m));
	let neww = [];
	for (const fold of folds.split("\n")) {
		let f = fold.replace('fold along ', '')
		let [axis, val] = f.split("=")

		if (axis == 'y') {
			neww = create(Number(val), prev[0].length)
			copy(neww, prev);
			for (let r = Number(val) + 1; r < prev.length; r++) {
				for (let c = 0; c < prev[0].length; c++) {
					if (prev[r][c] === '#') {
						neww[Number(val) - (r - Number(val))][c] = '#'
					}
				}
			}
		}

		if (axis == 'x') {
			neww = create(prev.length, Number(val))
			copy(neww, prev);
			for (let r = 0; r < prev.length; r++) {
				for (let c = Number(val) + 1; c < prev[0].length; c++) {
					if (prev[r][c] === '#') {
						neww[r][Number(val) - (c - Number(val))] = '#'
					}
				}
			}
		}
		prev = JSON.parse(JSON.stringify(neww));
	}

	for (let r = 0; r < neww.length; r++) {
		console.log(neww[r].map(x => x === null ? ' ' : x).join(""))
	}
}

load("13.txt", '\n\n')
	.then(run)