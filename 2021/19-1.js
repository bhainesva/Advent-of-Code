import { load } from "./helpers.js";
import R, { divide } from "ramda"

const numSort = R.sort((a, b) => a - b)
const eq = (a, b) => R.equals(numSort(a), numSort(b));
const merge = R.zipWith((a, b) => Math.abs(a - b))
const has = (s, el) => {
	for (const e of s) {
		if (eq(e, el)) return true;
	}

	return false;
}
const order = (order, l) => R.map(i =>  l[i], order)

const getCandidateMatches = (diffs1, diffs2) => {
	const candidates = []
	for (const d1 of diffs1) {
		for (const d2 of diffs2) {
			// console.log("Checking: ", d1, d2)
			if (eq(d1.diff, d2.diff)) {
				console.log("Found match: ", d1, d2)
				const idxOrder = R.sort((i, j) => d1.diff.indexOf(d2.diff[i]) - d1.diff.indexOf(d2.diff[j]), [0,1,2])
				const bNormal = order(idxOrder, d2.a);
				const normalizer = R.zipWith((a, b) => a - b, d1.a, bNormal);
				console.log(idxOrder, normalizer)
				// return;
				candidates.push({order: idxOrder, offset: normalizer});
			}
		}
	}
	return candidates
	return R.uniq(candidates)
}

const normalizeBy = (norm, pts) => {
	return R.map(pt => {
		const reordered = order(norm.order, pt)
		const offset = R.zipWith(R.add, norm.offset, reordered)
		return offset;
	}, pts)
}

const run = (arr) => {
	const scanMap = new Map();
	for (const [i, scanner] of arr.entries()) {
		const beacons = R.tail(scanner.split("\n"))
			.map(pos => pos.split(",").map(Number))

		scanMap.set(i, beacons);
	}
	// console.log(scanMap);

	const diffMap = new Map();
	for (const [scanNum, scans] of scanMap.entries()) {
		const s = new Set();

		for (let i = 0; i < scans.length; i++) {
			for (let j = i+1; j < scans.length; j++) {
				const diff = merge(scans[i], scans[j]);
				s.add({diff, a: scans[i], b: scans[j]})
			}
		}
		diffMap.set(scanNum, s);
	}

	const alignments = [];
	for (let i = 0; i < diffMap.size; i++) {
		for (let j = i+1; j < diffMap.size; j++) {
			alignments.push(findAlignment(scanMap, diffMap, i, j));
		}
	}

	console.log(alignments.filter(x => x !== null))
}

const findAlignment = (scans, diffs, i, j) => {
	const cands = getCandidateMatches(diffs.get(i), diffs.get(j))
	console.log("Candidates for: ", i, j, cands)
	for (const c of cands) {
		console.log("Trying: ", c)
		const normed = normalizeBy(c, scans.get(j))
		console.log("I scans: ", scans.get(i))
		console.log("Normed J scans", normed);
		const overlap = R.intersection(scans.get(i), normed);
		console.log("Overlap length: ", overlap.length, overlap)
		return;
		if (overlap.length >= 12) return [i, j, c]
	}
	return null
}

// console.log(merge([1,2,3], [3,2,1]))
load("19.txt", '\n\n')
	.then(run)