import { l, load } from './helpers.js';
import R from 'ramda';

function parseRule(rule) {
  const ranges = rule.split(" or ")
  return ranges.map(R.pipe(R.split('-'), R.map(Number)))
}

function valid(rule, num) {
  for (const range of rule) {
    const [low, high] = range;
    if (low <= num && num <= high) return true
  }

  return false;
}

const passesAny = R.curry((rules, num) => {
  return R.reduce((_, rule) => valid(rule, num) ? R.reduced(true) : false, false, rules)
})

function invalidTicketNumbers(rules, ticket) {
  return R.reject(passesAny(rules), ticket)
}

async function main() {
  const rows = await load('16.txt', '\n\n')
  const [fields, mine, nearby] = rows;

  const rules = fields.split("\n")
    .map(R.split(": "))
    .map(R.nth(1))
    .map(parseRule)

  const tickets = nearby.split("\n")
    .slice(1)
    .map(R.split(","))
    .map(R.map(Number))

  const errRate = R.reduce((total, ticket) => {
    return total += R.sum(invalidTicketNumbers(rules, ticket))
  }, 0, tickets)

  console.log(errRate);
}

main();