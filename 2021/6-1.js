import { load } from "./helpers.js";
import R from 'ramda';

const run = (arr) => {
	const nums = arr[0].split(",").map(Number);

	const m = new Map();
	for (let i = 0; i <=  8; i++) {
		m.set(i, 0);
	}
	for (const num of nums) {
		m.set(num, m.get(num) + 1);
	}

	for (let day = 0; day < 256; day++) {
		const newFish = m.get(0) || 0;
		for (let count = 0; count < 8; count++) {
			m.set(count, m.get(count + 1));
		}
		m.set(6, m.get(6) + newFish)
		m.set(8, newFish)
	}
	console.log(R.sum(m.values()))
}

load("6.txt")
	.then(run)