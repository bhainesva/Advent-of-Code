import R from 'ramda';

const init = (program) => ({
  mem: program,
  pointer: 0,
  relativeBase: 0,
  backingMem: {},
});

const run = (comp) => {
  while (comp.pointer != -1) {
    comp = step(comp);
  }

  return comp;
}

const parseModes = (op, n) => {
  const long = getOp(op)
        .padStart(n + 2, '0')
  return long.substring(0, long.length - 2)
        .split('')
        .reverse();
}

const readArgs = (state, n) => {
  const args = R.zipWith(
    (mode, val) => ({mode, val}),
    parseModes(state.mem[state.pointer], n),
    state.mem.slice(state.pointer + 1, state.pointer + n + 1)
  );
  return args;
}

const getParam = (state, param) => {
  if (param.mode == '1') {
    return param.val;
  } else if (param.mode == '2') {
    return get(state, param.val + state.relativeBase);
  }

  return get(state, param.val);
}

const get = (state, idx) => {
  if (idx >= state.mem.length) {
    if (state.backingMem[idx]) return state.backingMem[idx];
    state.backingMem[idx] = 0;
    return 0;
  }

  return state.mem[idx];
}

const setParam = (state, param, val) => {
  if (param.mode == '2') {
    return set(state, state.relativeBase + param.val, val)
  }

  return set(state, param.val, val)
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

const step = (state) => {
  const op = getOp(state.mem[state.pointer]);
  switch (baseOp(op)) {
    case '01':
      return add(state, op);
    case '99':
      console.log('Finished.');
      return R.assoc('pointer', -1, state)
    default:
      console.log(`Unrecognized op: ${op}`);
      return R.assoc('pointer', -1, state)
  }
}

// Ops
const add = (state, op) => {
  const args = readArgs(state, 3, parseModes(op));
  return {
    ...state,
    pointer: state.pointer + 4,
    mem: setParam(state, args[2], R.sum(args.slice(0, 2).map(param => getParam(state, param)))).mem,
  };
}

const getOp = (n) => String(n).padStart(2, '0');
const baseOp = (op) => op.substring(op.length - 2);

const c = init([1, 1, 1, 0, 99]);
const res = run(c);
console.log(res);
