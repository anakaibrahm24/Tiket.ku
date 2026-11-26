const fs = require('fs');
const base = 'D:/naka/project/Tiket.ku_Fork_V.2/src';
const g = JSON.parse(fs.readFileSync(base + '/.ua/intermediate/assembled-graph.json','utf8'));
const L = JSON.parse(fs.readFileSync(base + '/.ua/intermediate/layers.json','utf8'));
const input = {
  nodes: g.nodes,
  edges: g.edges,
  layers: L.map(l => ({ id: l.id, name: l.name, description: l.description }))
};
fs.writeFileSync(base + '/.ua/tmp/ua-tour-input.json', JSON.stringify(input));
console.log('nodes', input.nodes.length, 'edges', input.edges.length, 'layers', input.layers.length);
