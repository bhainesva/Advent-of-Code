import { l, load } from '../helpers.js';
import { parseBagRule } from './7.js';
import R from 'ramda';

const addRuleToGraph = (graph, rule) => {
  const [source, edges] = parseBagRule(rule);

  return graph.has(source)
    ? graph.set(source, [...graph.get(source), ...edges])
    : graph.set(source, edges)
}

const countSubBags = (g, node) => R.reduce((count, bag) =>
  count + bag.weight + (bag.weight * countSubBags(g, bag.name))
, 0, g.get(node) || []);

async function main() {
  const rules = await load('7.txt');
  const graph = R.reduce(addRuleToGraph, new Map(), rules);
  l(countSubBags(graph, 'shiny gold'));
}

main();
