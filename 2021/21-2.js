import R from "ramda"

const move = (pos, steps) => {
	let place = pos + steps;
	while (place > 10) {
		place -= 10;
	}
	return place
}

const combs = [[1,1,1], [1,1,2], [1,1,3], [1,2,1], [1,2,2], [1,2,3], [1,3,1], [1,3,2], [1,3,3], [2,1,1], [2,1,2], [2,1,3], [2,2,1], [2,2,2], [2,2,3], [2,3,1], [2,3,2], [2,3,3], [3,1,1], [3,1,2], [3,1,3], [3,2,1], [3,2,2], [3,2,3], [3,3,1], [3,3,2], [3,3,3]]
const combValues = R.map(R.sum, combs)

const [p1, p2] = [2, 5]

const other = p => p === "1" ? "2" : "1"

const run = () => {
	// p1 position -> p2 position -> p1 score -> p2 score -> count;
	let state = new Map();
	for (let p1pos = 1; p1pos <= 10; p1pos++) {
		const p1posMap = new Map();
		for (let p2pos = 1; p2pos <= 10; p2pos++) {
			const p2posMap = new Map();
			for (let p1score = 0; p1score <= 30; p1score++) {
				const p1ScoreMap = new Map();
				for (let p2score = 0; p2score <= 30; p2score++) {
					p1ScoreMap.set(p2score, 0)
				}
				p2posMap.set(p1score, p1ScoreMap)
			}
			p1posMap.set(p2pos, p2posMap)
		}
		state.set(p1pos, p1posMap)
	}
	state.get(p1).get(p2).get(0).set(0, 1)

	let current = "1";
	let done = false;
	let count = 0;
	while (!done) {
		done = true;
		count++;
		let newState = new Map();
		for (let p1pos = 1; p1pos <= 10; p1pos++) {
			const p1posMap = new Map();
			for (let p2pos = 1; p2pos <= 10; p2pos++) {
				const p2posMap = new Map();
				for (let p1score = 0; p1score <= 30; p1score++) {
					const p1ScoreMap = new Map();
					for (let p2score = 0; p2score <= 30; p2score++) {
						p1ScoreMap.set(p2score, 0)
					}
					p2posMap.set(p1score, p1ScoreMap)
				}
				p1posMap.set(p2pos, p2posMap)
			}
			newState.set(p1pos, p1posMap)
		}

		for (const [p1pos, p1map] of state.entries()) {
			for (const [p2pos, p2map] of p1map.entries()) {
				for (const [p1score, p1smap] of p2map.entries()) {
					for (const [p2score, count] of p1smap.entries()) {
						if (count === 0) continue;
						if (current === "1") { 
							if (p1score >= 21 || p2score >= 21) {
									const existingNewStateVal = newState.get(p1pos).get(p2pos).get(p1score).get(p2score);
									newState.get(p1pos).get(p2pos).get(p1score).set(p2score, existingNewStateVal + count)
							} else {
								for (const val of combValues) {
									done = false;
									const newPos = move(p1pos, val)
									const newScore = p1score + newPos
									const existingNewStateVal = newState.get(newPos).get(p2pos).get(newScore).get(p2score);
									newState.get(newPos).get(p2pos).get(newScore).set(p2score, existingNewStateVal + count)
								}
							}
						} else {
							if (p1score >= 21 || p2score >= 21) {
									const existingNewStateVal = newState.get(p1pos).get(p2pos).get(p1score).get(p2score);
									newState.get(p1pos).get(p2pos).get(p1score).set(p2score, existingNewStateVal + count)
							} else {
								for (const val of combValues) {
									done = false;
									const newPos = move(p2pos, val)
									const newScore = p2score + newPos
									const existingNewStateVal = newState.get(p1pos).get(newPos).get(p1score).get(newScore);
									newState.get(p1pos).get(newPos).get(p1score).set(newScore, existingNewStateVal + count)
								}
							}
						}
					}
				}
			}
		}

		state = newState
		current = other(current);
	}

	let p1Winners = 0;
	let p2Winners = 0;
	for (const [p1pos, p1map] of state.entries()) {
		for (const [p2pos, p2map] of p1map.entries()) {
			for (const [p1score, p1smap] of p2map.entries()) {
				for (const [p2score, count] of p1smap.entries()) {
					if (count === 0) continue;
					if (p1score > p2score) {
						p1Winners += count;
					} else {
						p2Winners += count;
					}
				}
			}
		}
	}
	console.log(Math.max(p1Winners, p2Winners))
}

run();