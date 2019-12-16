import R from 'ramda';
import { promises as fs, stat } from 'fs';
import readline from 'readline';

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

const askQuestion = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', (key) => {
    process.stdin.setRawMode(false)
    if (key == '\u001B\u005B\u0043') {
        // process.stdout.write('right');
        resolve(1)
    }
    else if (key == '\u001B\u005B\u0044') {
        // process.stdout.write('left');
        resolve(-1)
    } else if (key == '\u0003') {
      process.exit();
    } else {
      resolve(0)
    }
    // resolve()
  }))
}

let c = 0;

const step = async (state, input, output) => {
  let op = state.mem[state.pointer];
  op = String(op).padStart(2, '0');

  // Input
  if (effectiveOp(op) === '03') {
    let targetIdx = state.mem[state.pointer + 1];
    if (parseModes(op)[0] == '2') {
      targetIdx += state.rbase;
    }
    const value = await input();
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

const runProgram = async (program, input, output) => {
  let state = {
    pointer: 0,
    mem: program,
    rbase: 0,
    backingMem: {},
  }

  while (state.pointer !== -1) {
    state = await step(state, input, output);
    // console.log("after: ", state);
  }
}

const tile = (id) => {
  switch (id) {
    case 0:
      return ' ';
    case 1:
      return 'x';
    case 2:
      return 'B';
    case 3:
      return '+';
    case 4:
      return 'o'
  }
}

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = parseFile(input);

  const screen = [...Array(25)].map(x => [...Array(36)].fill('x'))
  let outs = []; // x y id
  print(screen);


  parsed[0] = 2;
  let prevBallPos = null;
  runProgram(parsed,
    async () => {
      // const inp = await askQuestion("joystick input: ");
      const inp = await keypress();
      return inp
      // return inp == 'j' ? -1 : (inp == '' ? 0 : 1);
      // const paddleDest = findPath(screen, ballPos, prevBallPos);
      // const paddlePos = findItem(screen, '_');
      // if (paddlePos > paddleDest) {
      //   return -1;
      // } else if (paddlePos == paddleDest) {
      //   return 0;
      // } else {
      //   return 1;
      // }
    },
    (out) => {
      outs.push(out);
      if (outs.length == 3) {
        let shouldPrint = screen[outs[1]][outs[0]] != outs[3]
        if (outs[0] == -1 && outs[1] == 0) {
          shouldPrint = true;
          screen[0][0] = outs[2];
        } else {
          screen[outs[1]][outs[0]] = tile(outs[2]);
          if (tile(outs[2]) == 'o') {
            const curPos = findItem(screen, 'o');
            if (prevBallPos && curPos) {
              replaceAll(screen, '-', ' ')
              replaceAll(screen, '*', 'B')
              findPath(screen, curPos, prevBallPos)
            }
            prevBallPos = [...curPos];
          }
        }
        clear();
        if (shouldPrint) {
          // console.log("Ball: ", findItem(screen, 'o'), "        Paddle: ", findItem(screen, '+'));
          print(screen);
        }
        outs = [];
      }
    });
}

const clear = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f')
}

// paddle lives at y=22
const findItem = (screen, target) => {
  for (let y = 0; y < screen.length; y++) {
    for (let x = 0; x < screen[0].length; x++) {
      if (screen[y][x] == target) return [x, y];
    }
  }
}

const replaceAll = (screen, target, w) => {
  for (let y = 0; y < screen.length; y++) {
    for (let x = 0; x < screen[0].length; x++) {
      if (screen[y][x] == target) screen[y][x] = w;
    }
  }
}

const nextPos = (screen, x, y, goingRight, goingUp) => {
  // const copy = screen.map(x => [...x]);
  const nextY = y + (goingUp ? -1 : 1)
  const nextX = x + (goingRight ? 1 : -1)
  const nextYCell = screen[nextY][x];
  const nextXCell = screen[y][nextX];
  const nextDiagCell = screen[nextY][nextX];
  if (['B','x'].includes(nextYCell) && !['B','x'].includes(nextXCell)) {
    if (screen[nextY][x] == 'B') screen[nextY][x] = '*';
    return [x, y, goingRight, !goingUp];
  }

  if (['B','x'].includes(nextXCell) && !['B','x'].includes(nextYCell)) {
    if (screen[y][nextX] == 'B') screen[y][nextX] = '*';
    return [x, y, !goingRight, goingUp];
  }

  if (['B','x'].includes(nextXCell) && ['B','x'].includes(nextYCell)) {
    if (screen[y][nextX] == 'B') screen[y][nextX] = '*';
    if (screen[nextY][x] == 'B') screen[nextY][x] = '*';
    return [x, y, !goingRight, !goingUp];
  }

  if (['B','x'].includes(nextDiagCell)) {
    if (screen[nextY][nextX] == 'B') screen[nextY][nextX] = '*';
    return [x, y, !goingRight, !goingUp];
  }

  return [nextX, nextY, goingRight, goingUp];
}

const findPath = (screen, ballPos, prevPos) => {
  // const screenCopy = screen.map(x => [...x]);
  let goingUp = ballPos[1] - prevPos[1] > 0 ? false : true;
  let goingRight = ballPos[0] - prevPos[0] > 0 ? true : false;

  let curPos = [...ballPos];
  // console.log("finding path from :", curPos);
  while (curPos[1] != 22) {
    // console.log(curPos);
    if (screen[curPos[1]][curPos[0]] == ' ') screen[curPos[1]][curPos[0]] = '-';
    const [curX, curY] = curPos;

    const nextState = nextPos(screen, curX, curY, goingRight, goingUp)
    const newX = nextState[0];
    const newY = nextState[1];
    goingRight = nextState[2];
    goingUp = nextState[3];
    curPos = [newX, newY]
  }

  return curPos[0];
}


const print = (screen) => {
  for (const row of screen) {
    console.log(row.join(''))
  }
}

run();