import R from 'ramda';

const types = {
  MASK: "mask",
  SET: "set",
}

const parseCmd = str => {
  let [l, r] = str.split(" = ");
  if (l.includes("mask")) return {type: types.MASK, vals: [r]}

  const addr = Number(l.match(/\d+/));
  return {type: types.SET, vals: [addr, Number(r)]}
}

const getAdapter = cmdRunner => R.pipe(
  R.map(parseCmd),
  R.reduce(cmdRunner, new Map()),
);

const toBin = dec => (dec >>> 0).toString(2).padStart(36, "0");

export {
  types,
  toBin,
  getAdapter,
}