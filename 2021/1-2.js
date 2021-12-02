import { load } from "./helpers.js";

const main = async () => {
	let arr = await load("1.txt")
		.then(x => x.map(Number))

	let count = 0;
	for (let i = 0; i < arr.length - 3; i++) {
		const a = arr[i] + arr[i+1] + arr[i+2];
		const b = arr[i+3] + arr[i+1] + arr[i+2];
		if (b > a) count++;
	}

	console.log(count);
}

main();