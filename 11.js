import R from 'ramda';
import { promises as fs, stat } from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split(','),
  String
);

const readArgs = (state, n, modes) => {
  const args = [];
  for (const i of [...Array(n)].keys()) {
    if (i < modes.length && modes[i] === '1') {
      args.push(get(state, state.pointer + 1 + i));
    } else if (i < modes.length && modes[i] === '2') {
      args.push(get(state, state.rbase + get(state, state.pointer + 1 + i)));
    } else {
      args.push(get(state, get(state, state.pointer + 1 + i)));
    }
  }

  return args;
}

const get = (state, idx) => {
  if (idx >= state.mem.length) {
    if (state.backingMem[idx]) return state.backingMem[idx];
    state.backingMem[idx] = 0;
    return 0;
  }

  return state.mem[idx];
}

const set = (state, idx, val) => {
  if (idx >= state.mem.length) {
    state.backingMem[idx] = val;
    return state;

  }

  const newMem = R.update(idx, val, state.mem);
  return {
    ...state,
    mem: newMem,
  }
}

const parseModes = (op) => {
  const m = op.substring(0, op.length - 2).split('').reverse();
  return m
}

const effectiveOp = (op) => {
  return op.substring(op.length - 2);
}

let c = 0;

const step = (state, input, output) => {
  let op = state.mem[state.pointer];
  op = String(op).padStart(2, '0');

  // Input
  if (effectiveOp(op) === '03') {
    let targetIdx = state.mem[state.pointer + 1];
    if (parseModes(op)[0] == '2') {
      targetIdx += state.rbase;
    }
    const value = input();
    return {
      ...state,
      pointer: state.pointer + 2,
      mem: set(state, targetIdx, value).mem,
    };
  } else if (effectiveOp(op) === '01') { // Sum
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    return {
      ...state,
      pointer: state.pointer + 4,
      mem: set(state, targetIdx, R.sum(args)).mem,
    };
  } else if (effectiveOp(op) === '02') { // Product
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    return {
      ...state,
      pointer: state.pointer + 4,
      mem: set(state, targetIdx, R.product(args)).mem,
    };
  } else if (effectiveOp(op) === '99') { // Exit
    console.log("Finished");
    return {
      ...state,
      pointer: -1
    };
  } else if (effectiveOp(op) === '04') { // Output
    const args = readArgs(state, 1, parseModes(op));
    output(args[0]);
    return {
      ...state,
      pointer: state.pointer + 2,
    };
  } else if (effectiveOp(op) === '05') { // Jump If True
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] !== 0) {
      return {
        ...state,
        pointer: args[1]
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 3,
      };
    }
  } else if (effectiveOp(op) === '06') { // Jump if False
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] === 0) {
      return {
        ...state,
        pointer: args[1],
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 3,
      };
    }
  } else if (effectiveOp(op) === '07') { // less than
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    if (args[0] < args[1]) {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 1).mem,
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 0).mem,
      };
    }
  } else if (effectiveOp(op) === '08') { // Equals
    const args = readArgs(state, 2, parseModes(op));
    let targetIdx = state.mem[state.pointer + 3];
    // console.log("args: ", args);
    if(parseModes(op)[2] == '2') {
      targetIdx += state.rbase;
    }
    if (args[0] === args[1]) {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 1).mem,
      };
    } else {
      return {
        ...state,
        pointer: state.pointer + 4,
        mem: set(state, targetIdx, 0).mem,
      };
    }
  } else if (effectiveOp(op) === '09') { // Adjust Rbase
    return op09(state, op);
  }
}

const op09 = (state, op) => {
  const args = readArgs(state, 1, parseModes(op));
  return {
    ...state,
    pointer: state.pointer + 2,
    rbase: state.rbase + args[0],
  }
}



const runProgram = (program) => {
  let state = {
    pointer: 0,
    mem: program,
    rbase: 0,
    backingMem: {},
    pos: [0, 0],
    direction: 1,
    hull: {'0,0': 1},
    painted: new Set(),
    facing: 1,
  }

  let painting = true;
  while (state.pointer !== -1) {
    state = step(state,
      () => {
        // console.log("Getting pos: ", state.pos, state.hull[state.pos.toString()] ? 1 : 0);
        return state.hull[state.pos.toString()] ?  1 : 0;
      },
      (out) => {
        if (painting) {
          console.log("painting: ", out);
          state.painted.add(state.pos.toString());
          state.hull[state.pos.toString()] = out;
        } else {
          console.log("Current pos: ", state.pos);
          if (out == 1) {
            state.facing += 1;
          } else {
            state.facing -= 1
          }
          if (state.facing == 0) state.facing = 4;
          if (state.facing == 5) state.facing = 1;

          if (state.facing == 1) state.pos = [state.pos[0], state.pos[1] + 1];
          if (state.facing == 2) state.pos = [state.pos[0] + 1, state.pos[1]];
          if (state.facing == 3) state.pos = [state.pos[0], state.pos[1] - 1];
          if (state.facing == 4) state.pos = [state.pos[0] - 1, state.pos[1]];
          console.log("Moving to:", state.pos);
        }

        painting = !painting;
      });
  }

  return state;
}


const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = parseFile(input);

  const out = runProgram(parsed);
  // console.log(out.painted.size);



  const thing = [...Array(200)].map(x => [...Array(200)].map(y => ' '))
  let minx = 0;
  let miny = 0;
  for (const pos of Object.keys(out.hull)) {
    let [x, y] = pos.split(',');
    x = Number(x) + 5;
    y = Number(y) + 5;
    console.log("pos", pos);
    console.log("setting: ", y, x);
    thing[y][x] = out.hull[pos] ? 1 : ' ';
    minx = Math.min(minx, Number(x));
    miny = Math.min(miny, Number(y));
  }
  // console.log(minx, miny);
  // console.log(out.hull);
  // console.log(thing);
  for (const x of thing) {
    console.log(x.join(''));
  }
}

run();