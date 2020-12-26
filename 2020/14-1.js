import { l, load } from './helpers.js';
import R from 'ramda';
import { types, getAdapter, toBin } from './14-common.js'

const fromBin = bin => parseInt(bin, 2)

const maskBit = (mask, val) => mask === "X" ? val : mask;
const mask = (mask, val) => R.zipWith(maskBit, mask, val).join("");

const getCmdRunner = () => {
  let maskStr = ""
  return (mem, cmd) => {
    const {type, vals} = cmd;
    type === types.MASK
      ? maskStr = vals[0]
      : mem.set(vals[0], fromBin(mask(maskStr, toBin(vals[1]))))
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