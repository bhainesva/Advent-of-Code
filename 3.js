import R from 'ramda';
import {promises as fs} from 'fs';

const parseFile = R.compose(
  R.map(R.split(',')),
  R.split('\n'),
  String
);

const getPoints = (steps, m) => {
  const pts = new Set();
  let pt = [0, 0];
  let n = 0;
  for (const step of steps) {
    const mod = ptModifier(step[0]);
    for (const i of [...Array(parseInt(step.slice(1))).keys()]) {
      n += 1;
      pt = mod(pt);
      pts.add(pt.toString())
      m[pt.toString()] = n;
    }
  }

  return pts;
}

const ptModifier = (dir) => {
  switch(dir) {
    case 'L':
      return ([x, y]) => [x-1, y]
    case 'R':
      return ([x, y]) => [x+1, y]
    case 'U':
      return ([x, y]) => [x, y+1]
    case 'D':
      return ([x, y]) => [x, y-1]
  }
}

const manhattan = (pt) => {
  const [x, y] = pt.split(',');
  return Math.abs(parseInt(x)) + Math.abs(parseInt(y));
}

const latency = (pt) => {
  const [x, y, steps] = pt.split(',');
  return
}


// const one = ["R8","U5","L5","D3"];
// const two = ["U7","R6","D4","L4"];

// const one = ["R75","D30","R83","U83","L12","D49","R71","U7","L72"];
// const two = ["U62","R66","U55","R34","D71","R55","D58","R83"];

const contains = (pt, array) => {
  for (const p of array) {
    if (p[0] === pt[0] && p[1] === pt[1]) return true;
  }

  return false
}

const input = fs.readFile('/Users/bhaines/Downloads/input.txt')
  .then(parseFile)
  .then((wires) => {
    const asteps = {};
    const bsteps = {};
    const seta = getPoints(wires[0], asteps);
    const setb = getPoints(wires[1], bsteps);
    const intersections = [...seta].filter(x => setb.has(x));
    return Math.min(...[...intersections].map((pt) => {
      return asteps[pt] + bsteps[pt];
    }))
  })
  .then(console.log);