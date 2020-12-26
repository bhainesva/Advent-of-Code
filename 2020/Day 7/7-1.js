import { l, load, span } from '../helpers.js';
import { parseBagRule } from './7.js';
import R from 'ramda';

const addRuleToGraph = (graph, rule) => {
    const [source, edges] = parseBagRule(rule);

    return R.reduce((graph, bagType) => graph.has(bagType.name)
        ? graph.set(bagType.name, [...graph.get(bagType.name), source])
        : graph.set(bagType.name, [source])
    , graph, edges);
}

async function main() {
  const rules = await load('7.txt')
  const graph = R.reduce(addRuleToGraph, new Map(), rules)
  l(span(graph, 'shiny gold', new Set()).size - 1);
}

main();
