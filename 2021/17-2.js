import { load } from "./helpers.js";

const minx = 124;
const maxx = 174;
const miny = -123;
const maxy = -86;

const step = (({x, y, dx, dy}) => {
	let newDx = null;
	if (dx < 0) {
		newDx = dx + 1;
	} else if (dx > 0) {
		newDx = dx - 1;
	} else {
		newDx = 0
	}

	return {
		x: x + dx,
		y: y + dy,
		dx: newDx,
		dy: dy - 1,
	}
})

const check = (state) => {
	let s = {...state}
	let max = 0;

	let prevx = s.x;
	while (s.y >= miny && s.x <= maxx) {
		if (minx <= s.x && s.x <= maxx && miny <= s.y && s.y <= maxy) {
			return {good: true, max: max};
		}
		s = step(s);
		if (s.x === prevx && (s.x <= minx || s.x >= maxx)) return {good: false}
		prevx = s.x;
		max = Math.max(s.y, max)
	}
	return {good: false, max: max};
}

const run = (arr) => {
	const initial = {x: 0, y: 0};
	let count = 0;
	for (let dx = 1; dx <= 175; dx++) {
		for (let dy = -130; dy <= 10000; dy++) {
			const res = check({...initial, dx, dy})
			if (res.good) {
				console.log("It's GooD!: ", dx, dy, res.max);
				count++;
			}
		}
	}
	console.log(count);
}

load("17.txt")
	.then(run)