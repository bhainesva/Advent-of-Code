import { load } from "./helpers.js";
import R from 'ramda';

const run = (lines) => {
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

		let [curX, curY] = sp;
		const [endX, endY] = ep;

		let dx = sp[0] < ep[0] ? 1 : -1;
		let dy = sp[1] < ep[1] ? 1 : -1;

		let done = false;
		while (!done) {
			const idx = (curY * maxX) + curX;
			const exist = counts.has(idx) ? counts.get(idx) : 0;
			counts.set(idx, exist + 1);
			if (curX == endX && curY == endY) done = true;
			if (curX !== endX) curX+=dx;
			if (curY !== endY) curY+=dy;
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
	.then(R.map(R.split(" -> ")))
	.then(run)