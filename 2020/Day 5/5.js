import R from 'ramda';

const lower = ({l, h}) => ({l, h: l + Math.floor((h - l) / 2)});
const upper = ({l, h}) => ({l: l + Math.ceil((h - l) / 2), h});
const step = (range, letter) => ['F','L'].includes(letter) ? lower(range) : upper(range);

export function getSeatId(seatCode) {
  const [rowCode, colCode] = R.splitAt(7, seatCode);
  const row = R.reduce(step, {l: 0, h: 127}, rowCode);
  const col = R.reduce(step, {l: 0, h: 7}, colCode);
  return row.l * 8 + col.l;
}