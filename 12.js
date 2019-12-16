
import R from 'ramda';
import { format } from 'path';

const pairsOfArray = array => (
  array.reduce((acc, val, i1) => [
    ...acc,
    ...new Array(array.length - 1 - i1).fill(0)
      .map((v, i2) => ([array[i1], array[i1 + 1 + i2]]))
  ], [])
)

const energy = (moons) => {
  let tot = 0;
  for (const moon of moons) {
    tot += R.sum(R.map(Math.abs, moon.pos)) * R.sum(R.map(Math.abs, moon.vel));
  }

  return tot;
}

// const moons = [
//   {pos: [-7, 17, -11], vel: [0, 0, 0]},
//   {pos: [9, 12, 5], vel: [0, 0, 0]},
//   {pos: [-9, 0, -4], vel: [0, 0, 0]},
//   {pos: [4, 6, 0], vel: [0, 0, 0]},
// ]

const moons = [
  {pos: [-1, 0, 2], vel: [0, 0, 0]},
  {pos: [2, -10, -7], vel: [0, 0, 0]},
  {pos: [4, -8, 8], vel: [0, 0, 0]},
  {pos: [3, 5, -1], vel: [0, 0, 0]},
]

const states = new Set();
let curState = JSON.stringify(moons);
let prevEnergy = 0;
let i = 0;
let pairs = pairsOfArray(moons);
while (!states.has(moons[0].toString())) {
// for (let i=0; i < 1000; i++) {
  // console.log(curState);
  for (const [m1, m2] of pairs) {
    if (m1.pos[0] < m2.pos[0]) {
      m1.vel[0] += 1;
      m2.vel[0] -= 1;
    } else if (m1.pos[0] > m2.pos[0]) {
      m1.vel[0] -= 1;
      m2.vel[0] += 1;
    }

    if (m1.pos[1] < m2.pos[1]) {
      m1.vel[1] += 1;
      m2.vel[1] -= 1;
    } else if (m1.pos[1] > m2.pos[1]) {
      m1.vel[1] -= 1;
      m2.vel[1] += 1;
    }

    if (m1.pos[2] < m2.pos[2]) {
      m1.vel[2] += 1;
      m2.vel[2] -= 1;
    } else if (m1.pos[2] > m2.pos[2]) {
      m1.vel[2] -= 1;
      m2.vel[2] += 1;
    }
  }

  for (const moon of moons) {
    moon.pos[0] += moon.vel[0];
    moon.pos[1] += moon.vel[1];
    moon.pos[2] += moon.vel[2];
  }

  const curEng = energy(moons);
  const curEngs = curEng + '|' + prevEnergy;
  states.add(moons[0].toString());
  i++;
}
console.log("found dupe: ", moons[0]);
// console.log(energy(moons));
// console.log(states.size);