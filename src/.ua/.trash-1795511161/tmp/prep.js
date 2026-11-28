const fs = require('fs');
const g = require('D:/naka/project/Tiket.ku_Fork_V.2/src/.ua/intermediate/assembled-graph.json');
const fileNodes = g.nodes.filter(n => n.type === 'file').map(n => ({
  id: n.id, type: n.type, name: n.name, filePath: n.filePath, summary: n.summary, tags: n.tags
}));
const fileIds = new Set(fileNodes.map(n=>n.id));
const fileEdges = g.edges.filter(e => fileIds.has(e.source) && fileIds.has(e.target));
const importEdges = fileEdges.filter(e => e.type === 'imports' || e.type === 'depends_on').map(e=>({source:e.source,target:e.target,type:'imports'}));
const allEdges = fileEdges.map(e=>({source:e.source,target:e.target,type:e.type}));
const input = { fileNodes, importEdges, allEdges };
fs.writeFileSync('D:/naka/project/Tiket.ku_Fork_V.2/src/.ua/tmp/ua-arch-input.json', JSON.stringify(input, null, 2));
console.log('files', fileNodes.length, 'importEdges', importEdges.length, 'allEdges', allEdges.length);