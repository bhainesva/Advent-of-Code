import { l, load } from './helpers.js';
import R from 'ramda';
import { promises as fs } from 'fs';

async function main() {
  const [rules, input] = await load('19-2.txt', '\n\n')

  const legalRules = ['grammar Grammar19;'];
  for (const rule of rules.split('\n')) {
    const tokens = rule.split(' ')
    const legal = 'a' + tokens.map(token => {
      return !isNaN(Number(token)) ? `a${token}` : token.replace(/"/g, "'");
    }).join(' ') + ' ;';
    console.log(rule, " --> ", legal);
    legalRules.push(legal);
  }

  fs.writeFile('Grammar19.g4', legalRules.join('\n'))
}

main();