import { l, load } from '../helpers.js';
import { parseInstruction, wrap, instructionFeedFor, defaultReducer, infiniteGenerator } from './8.js';
import R from 'ramda';

const loopDetecting = xf => {
  const seen = new Set();
  return wrap((result, item) => {
    if (seen.has(result.ip)) return R.reduced(result);
    seen.add(result.ip)
    return xf['@@transducer/step'](result, item)
  }, xf)
}

async function main() {
  const instructions = await load('8.txt')
    .then(R.map(parseInstruction));

  const transducer = R.compose(instructionFeedFor(instructions), loopDetecting);
  const finalState = R.transduce(transducer, defaultReducer, {ip: 0, acc: 0}, infiniteGenerator());
  console.log("Final: ", finalState.acc)
}

main();
