import { load } from "./helpers.js";

const run = (arr) => {
	let count = 0;
	for (const r of arr) {
		const [i, out] = r.split(" | ");
		const o = out.split(" ");

		for (const a of o) {
			if (a.length === 2 || a.length === 3 || a.length === 4 || a.length === 7) count++;
		}
	}
	console.log(count)
}

load("8.txt")
	.then(run)