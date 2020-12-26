import R from 'ramda';

export const wrappedX = (m, x) => x % m[0].length;

export const traverse = R.curry(([dx,dy], m) => R.until(
  state => state.y >= m.length,
  state => R.evolve({
    x: R.add(dx),
    y: R.add(dy),
    count: m[state.y][wrappedX(m, state.x)] === '#' ? R.add(1) : R.identity
  }, state),
  {x: 0, y: 0, count: 0},
))
