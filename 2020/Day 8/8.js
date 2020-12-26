import R from 'ramda';

// --- Data loading / parsing utils -----------
const parseInstruction = R.compose(R.adjust(1, Number), R.split(' '))

// --- Transducer utilities -------------
const wrap = (fn, xf) => ({
  '@@transducer/init': xf ? xf['@@transducer/init'] : () => {throw new Error("never called")},
  '@@transducer/step': fn,
  '@@transducer/result': xf ? xf['@@transducer/result'] : R.identity,
})

// --- Transducers --------------
const logging = xf => wrap((result, item) => {
  console.log('State:', result, 'Running:', item);
  return xf['@@transducer/step'](result, item)
}, xf)

const instructionFeedFor = instructions => xf => wrap(
  (state, instructionCounter) => state.ip === instructions.length
    ? R.reduced(state)
    : xf['@@transducer/step'](state, instructions[state.ip])
  , xf)

// --- Reduction Helpers
function* infiniteGenerator() {
  while (true) yield
}

const defaultReducer = (state, [opCode, val]) => {
  if (opCode === 'nop') return {...state, ip: state.ip + 1}
  if (opCode === 'acc') return {ip: state.ip + 1, acc: state.acc + val}
  if (opCode === 'jmp') return {...state, ip: state.ip + val}
}

export {
  parseInstruction,
  infiniteGenerator,
  defaultReducer,
  instructionFeedFor,
  wrap,
}