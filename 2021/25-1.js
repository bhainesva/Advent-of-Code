import { load } from "./helpers.js";

const k = (r, c) => `${r},${c}`;
const pt = key => key.split(",").map(Number)

const getEast = (r, c, g) => {
	return [r, (c+ 1) % g[0].length]
}

const getSouth = (r, c, g) => {
	return [(r + 1) % g.length, c]
}

const print = (easts, souths) => {
	let maxR = 0;
	let maxC = 0;
	for (let p of [...easts, ...souths]) {
		const [r, c] = pt(p);
		maxR = Math.max(r, maxR)
		maxC = Math.max(c, maxC)
	}

	let out = [];
	for (let r = 0; r <= maxR; r++) {
		let row = [];
		for (let c = 0; c <= maxC; c++) {
			if (easts.has(k(r, c))) row.push('>')
			else if (souths.has(k(r, c))) row.push('v')
			else row.push('.')
		}
		out.push(row);
	}

	console.log(out.map(row => row.join('')).join('\n'))
}

const run = (arr) => {
	const g = arr.map(row => row.split(""))
	let easts = new Set();
	let souths = new Set();
	for (let r = 0; r < g.length; r++) {
		for (let c = 0; c < g[0].length; c++) {
			if (g[r][c] === '>') easts.add(k(r, c))
			if (g[r][c] === 'v') souths.add(k(r, c))
		}
	}

	let step = 0;
	let moved = true;
	// print(easts, souths);
	while (moved) {
		// if (step > 2) break;
		step++;
		console.log("step: ", step)
		moved = false;
		let newEasts = new Set();
		let newSouths = new Set();

		for (let cell of easts) {
			const [r, c] = pt(cell);
			const [er, ec] = getEast(r, c, g)
			if (!souths.has(k(er, ec)) && !easts.has(k(er, ec))) {
				moved = true;
				newEasts.add(k(er, ec))
			} else {
				newEasts.add(k(r, c))
			}
		}
		easts = newEasts

		for (let cell of souths) {
			const [r, c] = pt(cell);
			const [er, ec] = getSouth(r, c, g)
			if (!souths.has(k(er, ec)) && !easts.has(k(er, ec))) {
				moved = true;
				newSouths.add(k(er, ec))
			} else {
				newSouths.add(k(r, c))
			}
		}
		souths = newSouths
		// print(easts, souths);
		// break
	}
	console.log("Stopped on: ", step)
}

load("25.txt")
	.then(run)