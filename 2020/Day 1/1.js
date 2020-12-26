import R from 'ramda';

const findSum = R.curry((target, nums) => {
  const seen = new Set();
  const first = R.find(num => {
    const found = seen.has(target - num)
    seen.add(num);
    return found;
  }, nums)
  return first !== undefined ? [target - first, first] : [];
});

export {
  findSum, // re-used in day 9
}