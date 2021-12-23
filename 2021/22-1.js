import { load } from "./helpers.js";
import R from 'ramda';

const k = (x,y,z) => `${x},${y},${z}`;

const run = (arr) => {
	console.log(arr);
	const on = new Set();
	for (const step of arr) {
		const [status, coords] = step.split(" ");
		const [xrange, yrange, zrange] = coords.split(",").map(coord => coord.substring(2).split("..").map(Number))
		for (let x = Math.max(-50, xrange[0]); x <= Math.min(50, xrange[1]); x++) {
			for (let y = Math.max(-50, yrange[0]); y <= Math.min(50, yrange[1]); y++) {
				for (let z = Math.max(-50, zrange[0]); z <= Math.min(50, zrange[1]); z++) {
					if (status === "on") {
						on.add(k(x,y,z))
					} else {
						on.delete(k(x,y,z))
					}
				}
			}
		}
	}

	console.log(on.size);
}

load("22.txt")
	.then(run)