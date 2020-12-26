export const parseBagRule = rule => {
  const [source, destPart] = rule.split(' bags contain ');

  const bagEdges = Array.from(destPart.matchAll(/(\d+) (\w+ \w+) bag/g))
    .map(match => ({name: match[2], weight: Number(match[1])}));
  return [source, bagEdges]
}
