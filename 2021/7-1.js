import { load } from "./helpers.js";
import R from 'ramda';

const score = (target, arr) => {
	let sc = 0;
	for (const n of arr) {
		sc += Math.abs(n - target);
	}

	return sc
}

const run = (arr) => {
	const nums = arr[0].map(Number);
	const min = Math.min(...nums);
	const max = Math.max(...nums);

	let bestScore = -1;
	let t = null;
	for (let target = min; target <= max; target++) {
		const s = score(target, nums);
		if (bestScore === -1 || s < bestScore) {
			bestScore = s
			t = target
		}
	}
	console.log(bestScore);
}

load("7.txt")
	.then(R.map(R.split(',')))
	.then(run)