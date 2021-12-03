import { load } from "./helpers.js";
import R from 'ramda';

const getMostLeast = (nums, idx) => {
	let o = 0;
	let z = 0;

	for (const n of nums) {
		if (n[idx] === '1') o++;
		if (n[idx] === '0') z++;
	}

	if (o >= z) return ['1', '0']
	return ['0', '1'];
}

const run = (arr) => {
	let oxy = [...arr];
	let co2 = [...arr];

	let i = 0;
	while (oxy.length !== 1) {
		const [most, least] = getMostLeast(oxy, i)
		oxy = oxy.filter(x => x[i] === most);
		i++;
	}

	i = 0;
	while (co2.length !== 1) {
		const [most, least] = getMostLeast(co2, i)
		co2 = co2.filter(x => x[i] === least);
		i++;
	}


	const gd = parseInt(oxy[0], 2);
	const ed = parseInt(co2[0], 2);

	console.log(oxy[0], gd)
	console.log(co2[0], ed)
	console.log(gd * ed)
}

load("3.txt")
	.then(run)