import { load } from "./helpers.js";
import R from 'ramda';

const decode = (ins) => {
	const one = ins.filter(x => x.length === 2)[0];
	const four = ins.filter(x => x.length === 4)[0];
	const seven = ins.filter(x => x.length === 3)[0];
	const len5 = ins.filter(x => x.length === 5);
	const len6 = ins.filter(x => x.length === 6);
	const t = diff(seven, one);
	let m = '';
	let tl = '';
	let tr = '';
	let br = '';
	let bl = '';
	let b = '';
	for (const el of shared(len5)) {
		if (four.includes(el)) m = el;
	}
	for (const char of four) {
		if (char !== m && !one.includes(char)) tl = char
	}
	for (const word of len6) {
		const miss = missing(word)[0];
		if (m !== miss && one.includes(miss)) tr = miss
		if (m !== miss && !one.includes(miss)) bl = miss
	}
	for (const c of one) {
		if (c !== tr) br = c;
	}
	for (const c of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
		if (c !== t && c!== m && c !== tl && c !== tr && c !== bl && c !== br) b = c;
	}

	return {t, tl, tr, m, bl, br, b};
}

const inter = ({t, tl, tr, m, bl, br, b}, str) => {
	if (str.length === 6 && !str.includes(m)) return 0;
	if (str.length === 2) return 1;
	if (str.length === 5 && !str.includes(tl) && !str.includes(br)) return 2;
	if (str.length === 5 && !str.includes(tl) && !str.includes(bl)) return 3;
	if (str.length === 4) return 4;
	if (str.length === 5 && !str.includes(tr) && !str.includes(bl)) return 5;
	if (str.length === 6 && !str.includes(tr)) return 6;
	if (str.length === 3) return 7;
	if (str.length === 7) return 8;
	if (str.length === 6 && !str.includes(bl)) return 9;
}

const missing = (word) => {
	const out = [];
	for (const l of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
		if (!word.includes(l)) out.push(l);
	}

	return out;
}

const intersect = (a, b) => {
	const out = new Set();
	for (const el of a) {
		if (b.has(el)) out.add(el);
	}

	return out;
}

const shared = (list) => {
	let out = new Set(list[0]);
	for (const word of list) {
		out = intersect(out, new Set(word))
	}

	return out;
}

const diff = (a, b) => {
	for (const c of a) {
		if (!b.includes(c)) return c;
	}
}

const run = (arr) => {
	let nums = [];
	for (const r of arr) {
		const [i, out] = r.split(" | ");
		const code = decode(i.split(" "));
		const o = out.split(" ");
		const nnn = o.map(str => inter(code, str)).join("");
		if (nnn.length !== 4) console.log(nnn, i, ' | ', out)
		nums.push(Number(nnn));
	}
	console.log(R.sum(nums))
}

load("8.txt")
	.then(run)