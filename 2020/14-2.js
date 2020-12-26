import { l, load } from './helpers.js';
import R from 'ramda';
import { types, getAdapter, toBin } from './14-common.js'

function mask(mask, val) {
  const bitPairs = R.zip(mask, val);
  return R.reduce((acc, bits) => {
    const [mBit, vBit] = bits;
    if (mBit == "0") return acc.map(x => x + vBit)
    if (mBit == "1") return acc.map(x => x + "1")
    return acc.flatMap(x => [x + "1", x + "0"])
  }, [""], bitPairs)
}

function getCmdRunner() {
  let maskStr = ""
  return (mem, cmd) => {
    const {type, vals} = cmd;
    type === types.MASK
      ? maskStr = vals[0]
      : mask(maskStr, toBin(vals[0]))
        .forEach(addr => mem.set(parseInt(addr, 2), vals[1]))
    return mem;
  }
}

async function main() {
  const cmds = await load('14.txt')
  const runAdapter = getAdapter(getCmdRunner())
  const mem = runAdapter(cmds)
  l(R.sum([...mem.values()]))
}

main();