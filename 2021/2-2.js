import { load } from "./helpers.js";
import R from 'ramda';

const step = ({x, a, d}, [cmd, n]) => {
	if (cmd === 'forward') return {x: x + n, a, d: d + a * n}
	if (cmd === 'up') return {x, d, a: a - n}
	if (cmd === 'down') return {x, d, a: a + n}
}

const run = (steps) => R.reduce(step, {x: 0, a: 0, d: 0}, steps);

load("2.txt")
	.then(arr => arr.map(x => R.adjust(1, Number, x.split(' '))))
	.then(run)
	.then(finalState => console.log(finalState.x * finalState.d));