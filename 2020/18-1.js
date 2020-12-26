import { l, load } from './helpers.js';
import R from 'ramda';

const operators = ["+", "*"]

const tokenize = R.split('')

const ops = ['*', '+'];
const isNum = x => !isNaN(Number(x))

const compute = (expr, i) => {
  let val = 0;
  let op = x => val = x;
  while (i < expr.length) {
    const cur = expr[i];
    if (isNum(cur)) val = op(Number(cur));
    if (cur == '*') {
      op = R.multiply(val);
    }
    if (cur == '+') {
      op = R.add(val);
    }
    i++;
    if (cur == ')') {
      return {val, i}
    }
    if (cur == '(') {
      const {i: newi, val: subval} = compute(expr, i)
      val = op(subval)
      i = newi;
    }
  }
  return {val, i}
}

async function main() {
  const rows = await load('18.txt')
    .then(R.map(R.replace(/\s+/g, "")))
    .then(R.map(tokenize))

  console.log(R.sum(rows.map(expr => compute(expr, 0).val)))
}

main();