import { load } from "./helpers.js";
import R from 'ramda';

const k = (x,y,z) => `${x},${y},${z}`;

// cube
// {
// 	x: []
// 	y: []
// 	z: []
// }

const valid = (region) => {
	return region.x[0] <= region.x[1] && region.y[0] <= region.y[1] && region.z[0] <= region.z[1]
}

const intersection = (r1, r2) => {
	return {
		x: [Math.max(r1.x[0], r2.x[0]), Math.min(r1.x[1], r2.x[1])],
		y: [Math.max(r1.y[0], r2.y[0]), Math.min(r1.y[1], r2.y[1])],
		z: [Math.max(r1.z[0], r2.z[0]), Math.min(r1.z[1], r2.z[1])],
	}
}

const intersect = (r1, r2) => {
	return !((r1.y[1] < r2.y[0] || r1.y[0] > r2.y[1]) &&
					 (r1.x[1] < r2.x[0] || r1.x[0] > r2.x[1]) &&
					 (r1.z[1] < r2.z[0] || r1.z[0] > r2.z[1]))
}

const volume = (r) => {
	return (1 + r.x[1] - r.x[0]) * (1 + r.y[1] - r.y[0]) * (1 + r.z[1] - r.z[0])
}

const run = (arr) => {
	let on = 0;
	const cubes = [];
	for (const step of arr) {
		const [status, coords] = step.split(" ");
		const [xrange, yrange, zrange] = coords.split(",").map(coord => coord.substring(2).split("..").map(Number))

		const region = {status: status, x: xrange, y: yrange, z: zrange};
		console.log("Region: ", step)
		if (status === "on") {
			let change = volume(region);

			console.log("Adding: ", volume(region))
			const alreadyTurnedOn = [];
			for (const otherRegion of cubes) { 
				const intt = intersection(otherRegion, region)
				for (const already of subtracted) {
					if (intersect(already, intt)) {
						on += volume(intersection(already, intt))
						console.log("Double Adding: ", volume(intersection(already, intt)))
					}
				}
				on -= volume(intt);
				console.log("Subtracting: ", volume(intt))
				subtracted.push(intt);
			}
		} else {
			const subtracted = [];
			for (const otherRegion of cubes) { 
				const intt = intersection(otherRegion, region)
				on -= volume(intt);
				console.log("Subtracting: ", volume(intt), "from intersection with : ", otherRegion)

				for (const already of subtracted) {
					if (intersect(already, intt)) {
						on += volume(intersection(already, intt))
					}
				}
				subtracted.push(intt);
			}
		}

		cubes.push(region);
	}

	console.log(on);
}

load("22.txt")
	.then(run)

// console.log(remainder({
// 	x: [0, 4],
// 	y: [0, 4],
// 	z: [0, 1],
// },
// {
// 	x: [1, 3],
// 	y: [1, 3],
// 	z: [0, 2],
// }))