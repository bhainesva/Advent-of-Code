import { load } from "./helpers.js";
import R from 'ramda';

const filterLen = len => R.filter(R.compose(R.equals(len), R.length))
const findLen = len => R.compose(R.head, filterLen(len));
const firstDiff = R.compose(R.head, R.difference)
const options = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const decode = (ins) => {
	const [one, four, seven] = R.juxt(R.map(findLen, [2, 4, 3]))(ins);
	const [len5, len6] = R.juxt(R.map(filterLen, [5, 6]))(ins);
	const t = R.difference(seven, one);
	const m = R.head(R.intersection(R.reduce(R.intersection, len5[0],len5), [...four]))
	const cands = R.filter(R.compose(R.not, R.equals(m)), R.chain(R.difference(options), len6));
	const tl = firstDiff([...four], [...one, m]);
	const tr = R.head(R.intersection([...one], cands));
	const bl = firstDiff(cands, [...one]);
	const br = R.find(R.compose(R.not, R.equals(tr)), one);

	return {t, tl, tr, m, bl, br};
}

const inter = R.curry(({tl, tr, m, bl, br}, str) => {
	if (str.length === 6 && !R.includes(m, str)) return 0;
	if (str.length === 2) return 1;
	if (str.length === 5 && R.isEmpty(R.intersection(str, [tl, br]))) return 2;
	if (str.length === 5 && R.isEmpty(R.intersection(str, [tl, bl]))) return 3;
	if (str.length === 4) return 4;
	if (str.length === 5 && R.isEmpty(R.intersection(str, [tr, bl]))) return 5;
	if (str.length === 6 && !R.includes(tr, str)) return 6;
	if (str.length === 3) return 7;
	if (str.length === 7) return 8;
	if (str.length === 6 && !R.includes(bl, str)) return 9;
})

const run = R.compose(
	R.sum,
	R.reduce((out, row) => {
		const [patterns, outputs] = row;
		const code = decode(R.split(" ", patterns));
		return [...out, R.join('', R.map(
			R.compose(Number, inter(code)), 
			R.split(" ", outputs)
		))];
	}, [])
)

load("8.txt")
	.then(R.map(R.split(" | ")))
	.then(run)
	.then(console.log)