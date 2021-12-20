import { load } from "./helpers.js";
import R from "ramda";

const k = (r, c) => `${r},${c}`;
const p = (pt) => pt.split(",").map(Number)

const other = char => char === '#' ? '.' : '#'

const surrounding = (r, c, lit, s) => {
	let char = lit ? '1' : '0'
	let fallback = lit ? '0' : '1'
	let out = '';
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			out += s.has(k(r + i, c + j)) ? char : fallback;
		}
	}
	// console.log(R.splitEvery(3, R.map(el => el === '1' ? '#' : '.', out).join('')).join("\n"), out, parseInt(out, 2))
	// console.log("Surrounding: ", r, c, out)
	return parseInt(out, 2);
}

const run = (arr) => {
	const alg = arr[0]
	const img = arr[1];

	const arr2d = img.split('\n').map(R.split(""));
	const imgSet = new Set();

	for (let r = 0; r<arr2d.length;r++) {
		for (let c = 0; c<arr2d[0].length;c++) {
			if (arr2d[r][c] === '#') imgSet.add(k(r, c));
		}
	}

	let active = '#';
	let prevSet = imgSet
	console.log("Starting size: ", prevSet.size);
	// const out = [...new Array(30)].map(el => new Array(30))
	// for (let r = -10; r < 20; r++) {
	// 	for (let c = -10; c < 20; c++) {
	// 		out[r+10][c+10] = prevSet.has(k(r, c)) ? '#' : '.'
	// 	}
	// }
	// console.log(out.map(row => row.join('')).join("\n"))
	for (let application = 0; application < 50; application++) {
		console.log("Running application: ", application)
		const newSet = new Set();
		let [minr, maxr, minc, maxc] = [0, 0, 0, 0];
		for (const pt of prevSet) {
			const [r, c] = p(pt);
			minr = Math.min(r, minr);
			maxr = Math.max(r, maxr);
			minc = Math.min(c, minc);
			maxc = Math.max(c, maxc);
		}

		for (let r = minr - 1; r <= maxr + 1; r++) {
			for (let c = minc - 1; c <= maxc + 1; c++) {
				const code = surrounding(r, c, active === '#', prevSet)
				const newChar = alg[code]
				if (newChar !== active) {
					newSet.add(k(r, c))
				}
			}
		}
		prevSet = newSet
		active = other(active);
	}

	// const out = [...new Array(30)].map(el => new Array(30))
	// for (let r = -10; r < 20; r++) {
	// 	for (let c = -10; c < 20; c++) {
	// 		out[r+10][c+10] = prevSet.has(k(r, c)) ? '#' : '.'
	// 	}
	// }
	// console.log(out.map(row => row.join('')).join("\n"))
	console.log(prevSet.size);
}

load("20.txt", '\n\n')
	.then(run)