import { l, load } from './helpers.js';
import R from 'ramda';

function parseRule(rule) {
  const ranges = rule.split(" or ")
  return ranges.map(R.pipe(R.split('-'), R.map(Number)))
}

const parseTicket = R.pipe(R.split(','), R.map(Number))

function valid(rule, num) {
  for (const range of rule) {
    const [low, high] = range;
    if (low <= num && num <= high) return true
  }

  return false;
}

const passesAnyRule = R.curry((rules, num) => {
  return R.reduce((_, rule) => valid(rule, num) ? R.reduced(true) : false, false, rules)
})

const allPassRule = (rule, nums) => {
  return R.reduce((_, num) => valid(rule, num) ? true : R.reduced(false), true, nums)
}

const ticketIsValid = R.curry((rules, ticket) => {
  return R.reduce((v, num) => passesAnyRule(rules, num) ? true : R.reduced(false), true, ticket);
})

async function main() {
  const rows = await load('16.txt', '\n\n')
  const [fieldRules, mine, nearby] = rows;

  const myTicket = mine.split('\n')
    .slice(1)
    .flatMap(parseTicket)

  const parsedFieldRules = fieldRules.split("\n")
    .map(R.split(": "))
    .map(R.adjust(1, parseRule));

  const fieldNames = parsedFieldRules.map(R.head)
  const validationRuleByField = new Map(parsedFieldRules);

  const tickets = nearby.split("\n")
    .slice(1)
    .map(parseTicket)

  const validTickets = tickets.filter(ticketIsValid(Array.from(validationRuleByField.values())))

  const nameToViablePositions = new Map(fieldNames.map(name => [name, []]));

  for (const [name, rule] of validationRuleByField.entries()) {
    for (let i = 0; i < fieldNames.length; i++) {
      const numsAtI = validTickets.map(R.nth(i));
      if (allPassRule(rule, numsAtI)) {
        nameToViablePositions.set(name, R.append(i, nameToViablePositions.get(name)))
      }
    }
  }

  const usedPositions = [];
  const sortedNames = fieldNames.sort((a, b) => nameToViablePositions.get(a).length - nameToViablePositions.get(b).length)
  const picks = new Map()
  for (const name of sortedNames) {
    const remaining = R.difference(nameToViablePositions.get(name), usedPositions)
    picks.set(remaining[0], name)
    usedPositions.push(remaining[0]);
  }

  console.log(myTicket.filter((_, i) => picks.get(i).includes('departure'))
    .reduce(R.multiply))
}

main();