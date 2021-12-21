import R from "ramda"

const die = {cur: 1}

const roll = (die) => {
	const cur = die.cur;
	die.cur++;
	if (die.cur === 101) die.cur = 1;
	return cur;
}

const move = (pos, steps) => {
	let place = pos + steps;
	while (place > 10) {
		place -= 10;
	}
	return place
}

const [p1, p2] = [2, 5]

const other = p => p === "1" ? "2" : "1"

const run = () => {
	let p1s = {pos: p1, score: 0}
	let p2s = {pos: p2, score: 0}

	let rolls = 0;
	let current = "1";
	while (p1s.score < 1000 && p2s.score < 1000) {
		const vals = [roll(die), roll(die), roll(die)];
		const val = R.sum(vals);
		if (current === "1") {
			p1s.pos = move(p1s.pos, val);
			p1s.score += p1s.pos;
		} else {
			p2s.pos = move(p2s.pos, val);
			p2s.score += p2s.pos;
		}

		rolls+=3;
		current = other(current)
	}

	if (p1s.score >= 1000) {
		console.log(p2s.score * rolls)
	} else {
		console.log(p1s.score * rolls)
	}
}

run();