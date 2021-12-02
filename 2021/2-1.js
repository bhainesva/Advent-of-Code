import { load } from "./helpers.js";
import R from 'ramda';

const step = ({x, d}, [cmd, n]) => {
	if (cmd === 'forward') return {x: x + n, d}
	if (cmd === 'up') return {x, d: d - n}
	if (cmd === 'down') return {x, d: d + n}
}

const run = (steps) => R.reduce(step, {x: 0, d: 0}, steps);

load("2.txt")
	.then(arr => arr.map(x => R.adjust(1, Number, x.split(' '))))
	.then(run)
	.then(finalState => console.log(finalState.x * finalState.d));