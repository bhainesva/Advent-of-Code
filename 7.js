import R from 'ramda';
import { promises as fs } from 'fs';

const parseFile = R.compose(
  R.map(Number),
  R.split(','),
  String
);

const readArgs = (state, n, modes) => {
  const args = [];
  for (const i of [...Array(n)].keys()) {
    if (i < modes.length && modes[i] === '1') {
      args.push(state.mem[state.pointer + 1 + i]);
    } else {
      args.push(state.mem[state.mem[state.pointer + 1 + i]]);
    }
  }

  return args;
}

const parseModes = (op) => {
  const m = op.substring(0, op.length - 2).split('').reverse();
  return m
}

const effectiveOp = (op) => {
  return op.substring(op.length - 2);
}

const step = (state, input, output) => {
  let op = state.mem[state.pointer];
  op = String(op).padStart(2, '0');
  // console.log("op: ", op)
  // console.log("state: ", state)

  if (effectiveOp(op) === '03') {
    const targetIdx = state.mem[state.pointer + 1];
    const value = input();
    return {
      pointer: state.pointer + 2,
      mem: R.update(targetIdx, value, state.mem),
    };
  } else if (effectiveOp(op) === '01') {
    const args = readArgs(state, 2, parseModes(op));
    // console.log("args: ", args);
    // console.log("setting index:", state.mem[state.pointer+3], " to", R.sum(args))
    return {
      pointer: state.pointer + 4,
      mem: R.update(state.mem[state.pointer + 3], R.sum(args), state.mem),
    };
  } else if (effectiveOp(op) === '02') {
    const args = readArgs(state, 2, parseModes(op));
    return {
      pointer: state.pointer + 4,
      mem: R.update(state.mem[state.pointer + 3], R.product(args), state.mem),
    };
  } else if (effectiveOp(op) === '99') {
    // console.log("Finished");
    return {
      ...state,
      pointer: -1
    };
  } else if (effectiveOp(op) === '04') {
    output(state.mem[state.mem[state.pointer + 1]]);
    return {
      ...state,
      pointer: state.pointer + 2,
    };
  } else if (effectiveOp(op) === '05') {
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
  } else if (effectiveOp(op) === '06') {
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
  } else if (effectiveOp(op) === '07') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] < args[1]) {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 1, state.mem),
      };
    } else {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 0, state.mem),
      };
    }
  } else if (effectiveOp(op) === '08') {
    const args = readArgs(state, 2, parseModes(op));
    if (args[0] === args[1]) {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 1, state.mem),
      };
    } else {
      return {
        pointer: state.pointer + 4,
        mem: R.update(state.mem[state.pointer + 3], 0, state.mem),
      };
    }
  }
}

const runProgram = (program, input, output) => {
  let state = {
    pointer: 0,
    mem: program,
  }

  while (state.pointer !== -1) {
    state = step(state, input, output);
  }
}

const permutations = (n, tokens, subperms = [[]]) =>
  n < 1 || n > tokens.length ?
    subperms :
    R.addIndex(R.chain)((token, idx) => permutations(
      n - 1,
      R.remove(idx, 1, tokens),
      R.compose(R.map, R.append)(token)(subperms)
    ), tokens);

const run = async () => {
  const input = await fs.readFile('/Users/bhaines/Downloads/input.txt');
  const parsed = parseFile(input);

  const test = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54,
    -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4,
    53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10]

  let maxOut = 0;
  for (const settings of permutations(5, [5, 6, 7, 8, 9])) {
    const amps = [
      { pointer: 0, mem: [...parsed] },
      { pointer: 0, mem: [...parsed] },
      { pointer: 0, mem: [...parsed] },
      { pointer: 0, mem: [...parsed] },
      { pointer: 0, mem: [...parsed] },
    ]

    let ampsInitialized = [false, false, false, false, false];

    let currentAmp = 0;
    let prevOutput = 0;
    while (
      amps[0].pointer != -1 ||
      amps[1].pointer != -1 ||
      amps[2].pointer != -1 ||
      amps[3].pointer != -1 ||
      amps[4].pointer != -1
    ) {
      if (amps[currentAmp].pointer == -1) {
        currentAmp += 1;
      }
      amps[currentAmp] = step(amps[currentAmp],
        () => {
          if (!ampsInitialized[currentAmp]) {
            ampsInitialized[currentAmp] = true;
            return settings[currentAmp];
          } else {
            return prevOutput;
          }
        },
        (out) => {
          currentAmp = currentAmp == 4 ? 0 : currentAmp + 1;
          prevOutput = out;
        });
    }
    maxOut = Math.max(maxOut, prevOutput);
  }
  console.log("Final: ", maxOut);

  // runProgram(parsed);
  // let settings  = [4,3,2,1,0];
  // let maxOut = 0;
  // for (const settings of permutations(5, [5, 6, 7, 8, 9])) {
  //   let prevOutput = 0;
  //   for (const amp of [...Array(5)].keys()) {
  //     runProgram(parsed, (() => {
  //       let i = 0;
  //       let inputs = [settings[amp], prevOutput];
  //       return () => {
  //         i += 1;
  //         return inputs[i-1];
  //       }
  //     })(), (out) => {
  //       prevOutput = out;
  //     })
  //   }
  //   maxOut = Math.max(prevOutput, maxOut);
  // }

}

run();