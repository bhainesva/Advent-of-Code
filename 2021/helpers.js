import { promises as fs } from 'fs';
import R from 'ramda';

const applyEach = R.curry((fns, x) => R.map(R.applyTo(x), fns))

const reduceDefault = R.curry((f, xs) => R.reduce(f, xs[0], xs))

function l(x) {console.log(x); return x};

const allTrue = R.all(R.identity)

const setOf = x => new Set(x);

const isSubset = R.curry((a, b) => a.size <= b.size && [...a].every(value => b.has(value)));

const reduceWithIndex = R.addIndex(R.reduce)

const product = R.reduce(R.multiply, 1)

// Graph functions
const addEdge = (graph, src, dest) => graph.has(src)
  ? graph.set(src, R.append(dest, graph.get(src)))
  : graph.set(src, [dest])

const span = (node, visited, graph) => R.reduce(
    (seen, n) => seen.has(n)
      ? seen
      : seen.add(...span(n, seen, graph))
  , visited.add(node), graph.get(node) || [])

function load(file, del = '\n') {
  return fs.readFile(file)
  .then(String)
  .then(s => s.trim())
  .then(x => x.split(del))
}

export {
  load,
  l,
  setOf,
  isSubset,
  allTrue,
  applyEach,
  reduceDefault,
  reduceWithIndex,
  span,
  addEdge,
  product,
}