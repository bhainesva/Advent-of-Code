import { l, load, reduceWithIndex, span, addEdge } from '../helpers.js';
import { parseInstruction, wrap, instructionFeedFor, defaultReducer, infiniteGenerator } from './8.js';
import R from 'ramda';

const constructInstructionGraph = reduceWithIndex((acc, cur, i) => {
    const dest = defaultReducer({ip: i, acc: 0}, cur).ip;
    return addEdge(acc, dest, i)
  }, new Map())

const getTerminatingIps = instructions => span(instructions.length,
  new Set(),
  constructInstructionGraph(instructions))

const loopFixingFor = instructions => xf => {
  const safeIps = getTerminatingIps(instructions);
  let fixed = false;

  return wrap((state, [opCode, val]) => {
    if (!fixed && opCode === 'jmp' || opCode === 'nop') {
      const nextIp = state.ip + (opCode === 'nop' ? 1 : val)
      const potentialNextIp = state.ip + (opCode === 'jmp' ? 1 : val)
      if (!safeIps.has(nextIp) && safeIps.has(potentialNextIp)) {
        console.log("Fixed loop at ip: ", state.ip)
        fixed = true;
        return xf['@@transducer/step'](state, [opCode === 'jmp' ? 'nop' : 'jmp', val]);
      }
    }
    return xf['@@transducer/step'](state, [opCode, val])
  }, xf);
}

async function main() {
  const instructions = await load('8.txt')
    .then(R.map(parseInstruction))

    const transducer = R.compose(instructionFeedFor(instructions), loopFixingFor(instructions));
    const finalState = R.transduce(transducer, defaultReducer, {ip: 0, acc: 0}, infiniteGenerator());
    console.log("Final: ", finalState.acc)
}

main();
