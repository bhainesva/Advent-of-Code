import { load } from "./helpers.js";
import R from 'ramda';

const run = (arr) => {
	let gamma = '';
	let eps = '';

	for (let i = 0; i < arr[0].length; i++) {
		let z = 0;
		let o = 0;
		for (const n of arr) {
			if (n[i] === '1') o++;
			if (n[i] === '0') z++;
		}

		if (z > o) {
			gamma += '0';
			eps += '1';
		} else {
			gamma += '1';
			eps += '0';
		}
	}

	const gd = parseInt(gamma, 2);
	const ed = parseInt(eps, 2);

	console.log(gd * ed)
}

load("3.txt")
	.then(run)