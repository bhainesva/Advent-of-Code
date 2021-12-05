import { load } from "./helpers.js";
import R from 'ramda';

const run = (arr) => {
	const lines = arr.map(dir => dir.split(" -> "))
	const counts = new Map();

	let maxX = 0;
	let maxY = 0;
	for (const line of lines) {
		const [start, end] = line;
		const sp = start.split(",").map(Number)
		const ep = end.split(",").map(Number)

		if (sp[0] !== ep[0] && sp[1] !== ep[1]) continue;
		maxX = Math.max(maxX, sp[0], ep[0])
		maxY = Math.max(maxY, sp[1], ep[1])
	}
	maxX++
	maxY++

	for (const line of lines) {
		const [start, end] = line;
		const sp = start.split(",").map(Number)
		const ep = end.split(",").map(Number)

		if (sp[0] !== ep[0] && sp[1] !== ep[1]) continue;
		if (sp[0] === ep[0]) {
			for (let y = Math.min(sp[1], ep[1]); y <= Math.max(ep[1], sp[1]); y++) {
				const idx = (y * maxX) + sp[0];
				const exist = counts.has(idx) ? counts.get(idx) : 0;
				counts.set(idx, exist + 1);
			}
		}

		if (sp[1] === ep[1]) {
			for (let x = Math.min(sp[0], ep[0]); x <= Math.max(ep[0], sp[0]); x++) {
				const idx = (sp[1] * maxX) + x;
				const exist = counts.has(idx) ? counts.get(idx) : 0;
				counts.set(idx, exist + 1);
			}
		}
	}

	let out = 0;
	for (const [k, v] of counts.entries()) {
		if (v > 1) {
			out++;
		}
	}
	console.log(out);
}

load("5.txt")
	.then(run)