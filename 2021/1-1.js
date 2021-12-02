import { load } from "./helpers.js";

const main = async () => {
	let arr = (await load("1.txt")).map(Number);

	let prev = null;
	const out = arr.reduce((count, cur) => {
		if (prev !== null && cur > prev) {
			prev = cur;
			return count + 1;
		}
		prev = cur;
		return count;
	}, 0)

	console.log(out);
}

main();