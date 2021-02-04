
import R from 'ramda';

const pairsOfArray = array => (
  array.reduce((acc, val, i1) => [
    ...acc,
    ...new Array(array.length - 1 - i1).fill(0)
      .map((v, i2) => ([array[i1], array[i1 + 1 + i2]]))
  ], [])
)

const compIdx = (m1s, m2s, n) => {
  // console.log("comparing: ", n);
  // console.log("for: ", m1s, m2s);
  for (let i = 0; i < 4; i++) {
    if (m1s[i].pos[n] != m2s[i].pos[n]) return false;
    if (m1s[i].vel[n] != m2s[i].vel[n]) return false;
  }
  // console.log("true");
  return true;
}

const energy = (moons) => {
  let tot = 0;
  for (const moon of moons) {
    tot += R.sum(R.map(Math.abs, moon.pos)) * R.sum(R.map(Math.abs, moon.vel));
  }

  return tot;
}

const moons = [
  {pos: [-7, 17, -11], vel: [0, 0, 0]},
  {pos: [9, 12, 5], vel: [0, 0, 0]},
  {pos: [-9, 0, -4], vel: [0, 0, 0]},
  {pos: [4, 6, 0], vel: [0, 0, 0]},
]

// Test 2
// const moons = [
//   {pos: [-8, -10, 0], vel: [0, 0, 0]},
//   {pos: [5, 5, 10], vel: [0, 0, 0]},
//   {pos: [2, -7, 3], vel: [0, 0, 0]},
//   {pos: [9, -8, -3], vel: [0, 0, 0]},
// ]

// const moons = [
  // {pos: [-1, 0, 2], vel: [0, 0, 0]},
  // {pos: [2, -10, -7], vel: [0, 0, 0]},
  // {pos: [4, -8, 8], vel: [0, 0, 0]},
  // {pos: [3, 5, -1], vel: [0, 0, 0]},
// ]

const init = [
  {pos: [-7, 17, -11], vel: [0, 0, 0]},
  {pos: [9, 12, 5], vel: [0, 0, 0]},
  {pos: [-9, 0, -4], vel: [0, 0, 0]},
  {pos: [4, 6, 0], vel: [0, 0, 0]},
]
let i = 1;
const found = [false, false, false];
let pairs = pairsOfArray(moons);
let go = true;
while (go) {
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

  for (let m = 0; m < 4; m++) {
    const moon = moons[m];
    moon.pos[0] += moon.vel[0];
    moon.pos[1] += moon.vel[1];
    moon.pos[2] += moon.vel[2];
  }
  // console.log(":", i, ":", moons);
  if (i !== 0) {
    if (i == 2770) {
        console.log('this shouldmatch')
        console.log(moons, init);
        console.log(compIdx(moons, init, 0));
        console.log(compIdx(moons, init, 1));
        console.log(compIdx(moons, init, 2));
    }
    for (let j=0; j < found.length; j++) {
      if (!found[j]) {
        const res = compIdx(moons, init, j);
        if (res) {
          console.log("Found loop for idx", j, i)
          console.log(moons, init);
        }
        found[j] = res
      }
    }
    if (R.all(R.equals(true), found)) go = false;
  }

  i++;
}

// console.log(energy(moons));
// console.log(states.size);
