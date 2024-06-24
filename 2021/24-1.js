import { load } from "./helpers.js";
import R from 'ramda';

let inpCount = 0;
let done = false;

const op = (state, [op, left, right]) => {
	const l = state[left];
	const r = (isNaN(right)) ? state[right] : Number(right);
	// if (done) return state;
	if (op === "inp") {
		// if (inpCount === 1) {
		// 	done = true;
		// 	console.log(state);
		// 	return state;
		// }
		state[left] = Number(state.input[state.i]);
		state.i++;
		// inpCount++;
	}
	if (op === "add") {
		state[left] = l + r;
	}
	if (op === "mul") {
		// console.log("Mul: ", left, right, l, r)
		state[left] = l * r;
	}
	if (op === "div") {
		state[left] = Math.floor(l / r);
	}
	if (op === "set") {
		state[left] = r
	}
	if (op === "mod") {
		state[left] = l % r;
	}
	if (op === "eql") {
		state[left] = l === r ? 1 : 0;
	}
	return state;
}

const test = (instructions, model) => {
	let state = {
		input: model,
		i: 0,
		w: 0,
		x: 0,
		y: 0,
		z: 0,
	}

	for (const instr of instructions) {
		state = op(state, instr.split(" "))
	}

	// console.log(state);
	return state;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const getCand = () => {
	let out = "";
	for (let i = 0; i < 14; i++) {
		out += getRandomInt(1, 10)
	}
	return out;
}

const run = (arr) => {
	for (let cand = 99999999999999; cand >= 0; cand--) {
		if (cand % 3000 === 0) console.log("Reached: ", cand)
		if (String(cand).includes("0")) continue;
		if (test(arr, String(cand))) {
			console.log("FOUND: ", cand)
			return
		}
	}
}

const ins = await load("24.txt");
const ins2 = await load("24-3.txt");

let fail = false
let cand = "";
for (let i = 0; i < 1000; i++) {
	cand = getCand()
	if (JSON.stringify(test(ins, cand)) !== JSON.stringify(test(ins2, cand))) {
		fail = true;
		break;
	}
}
console.log(fail ? `FAIL: ${cand}` : "SUCCESS")

for (let i = 1; i <= 9; i++) {
	let cand = `999979${i}11111112`;
	console.log()
	console.log(i, JSON.stringify(test(ins, cand)))
}

// for (let i = 9999999; i >= 1111111; i--) {
// 	if (i % 50000 === 0) console.log(i)
// 	const s = String(i)
// 	if (s.includes("0")) continue;
// 	if (test(ins, `99999${s[0]}${s[1]}9${s[2]}9${s[3]}${s[4]}${s[5]}${[6]}`).z === 0) console.log("Found: ", cand)
// }