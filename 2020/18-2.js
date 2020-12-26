import { l, load } from './helpers.js';
import R from 'ramda';

const operators = ["+", "*"]

const tokenize = R.split('')

const ops = ['*', '+'];
const isNum = x => !isNaN(Number(x))

const parenify = (expr, i) => {
  const out = [];
  let chunk = [];
  let justSawPlus = false;
  while (i < expr.length) {
    const cur = expr[i];

    if (isNum(cur)) {
      if (!justSawPlus) {
        out.push(...chunk)
        chunk = [cur]
      }
      else {
        chunk = ['(', ...chunk, cur, ')'];
      }
    } else if (cur == '(') {
      const {i: newi, expr: subexpr} = parenify(expr, i+1)
      if (justSawPlus) {
        chunk = ['(', ...chunk, '(', ...subexpr, ')', ')'];
      } else {
        out.push(...chunk)
        chunk = ['(', ...subexpr, ')'];
      }
      i = newi;
      continue;
    } else if (cur == '*') {
      out.push(...chunk, cur)
      chunk = [];
    } else if (cur == '+') {
      justSawPlus = true;
      chunk.push('+')
    } else if (cur == ')') {
      out.push(...chunk)
      return {i: i + 1, expr: out}
    }
    justSawPlus = cur === '+';
    i++;
  }
  out.push(...chunk)
  return {i, expr: out}
}

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

  const parened = rows.map((expr => parenify(expr, 0).expr))

  const answers = parened.map(expr => compute(expr, 0).val);

  console.log(R.sum(answers))
}

main();