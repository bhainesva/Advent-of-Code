import { load } from "./helpers.js";
import R from "ramda";

const setPath = (path, val, list) => {
	const p = [...path];
	let focus = list;
	while (p.length !== 1) {
		const i = p.shift();
		focus = focus[i];
	}
	focus[p[0]] = val
	// console.log("Focus: ", focus);
}

const prefixOf = (a, b) => {
	if (a.length > b.length) return false;
	for (const [i, el] of a.entries()) {
		if (el !== b[i]) return false;
	}

	return true;
}

const add = (a, b) => [a, b];

const hasExplode = (nn, depth) => {
	if (typeof nn === 'number') return false;
	if (depth >= 4) return true;

	return hasExplode(nn[0], depth+1) || hasExplode(nn[1], depth+1)
}

const traverser = (nn) => {
	let previousPath = null;
	let copy = [...nn];
	let explode = false;
	let explodePath = null;
	let explodeVal = null;
	let done = false;
	const hasEx = hasExplode(nn, 0);

	const trav = (n, currentPath) => {
		if (done) {
			return;
		} else if (typeof n === 'number') {
			// console.log("N: ", n, explode)
			if (explode) {
				if (!prefixOf(explodePath, currentPath)) {
					setPath(currentPath, n+explodeVal, copy)
					explode = false;
					done = true;
				}
			}
			if (n >= 10 && !hasEx) {
				setPath(currentPath, [Math.floor(n/2), Math.ceil(n/2)], copy)
				done = true;
			}
			previousPath = currentPath;
		} else {
			if (currentPath.length === 4 && !explode) {
				console.log("Exploding: ", n)
				explode = true;
				explodeVal = n[1];
				explodePath = currentPath;
				if (previousPath) {
					const prevValue = R.path(previousPath, copy)
					setPath(previousPath, prevValue+n[0], copy)
				}
				setPath(explodePath, 0, copy)
			} else {
				trav(n[0], [...currentPath, 0])
				trav(n[1], [...currentPath, 1])
			}
		}

		return copy;
	}
	return trav;
}

const mag = n => {
	if (typeof n === 'number') return n
	return (3 * mag(n[0])) + (2 * mag(n[1]))
}

const run = (arr) => {
	let sum = JSON.parse(arr[0]);
	for (let i = 1; i < arr.length; i++) {
		let n = JSON.parse(arr[i]);
		sum = add(sum, n)
		let prev = "";
		while (prev !== JSON.stringify(sum)) {
			prev = JSON.stringify(sum);
			sum = traverser(sum)(sum, []);
			console.log("SUM: ", JSON.stringify(sum))
		}
	}
	console.log("Result: ", JSON.stringify(sum))
	console.log(mag(sum))
}


// console.log(hasExplode([[[[[9,8],1],2],3],4], 0))
load("18.txt")
	.then(run)

// const x = [[1,2], 3]
// console.log(x);
// setPath([0,1], 9, x)
// console.log(x);
// console.log(R.path([1, 0], [[1,2],[3]]))