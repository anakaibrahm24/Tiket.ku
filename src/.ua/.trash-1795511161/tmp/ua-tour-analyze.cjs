const fs = require('fs');

function fail(msg){ console.error(msg); process.exit(1); }

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if(!inputPath || !outputPath) fail('usage: node script input.json output.json');

let data;
try { data = JSON.parse(fs.readFileSync(inputPath,'utf8')); } catch(e){ fail('read/parse input: ' + e.message); }

const nodes = data.nodes || [];
const edges = data.edges || [];
const layers = data.layers || [];

const nodeById = new Map(nodes.map(n => [n.id, n]));

// fan-in / fan-out (all edges)
const fanIn = new Map(nodes.map(n => [n.id, 0]));
const fanOut = new Map(nodes.map(n => [n.id, 0]));
const outEdges = new Map(nodes.map(n => [n.id, []]));
const inEdges = new Map(nodes.map(n => [n.id, []]));
for(const e of edges){
  if(outEdges.has(e.source)){ outEdges.get(e.source).push(e); fanOut.set(e.source, fanOut.get(e.source)+1); }
  if(inEdges.has(e.target)){ inEdges.get(e.target).push(e); fanIn.set(e.target, fanIn.get(e.target)+1); }
}

// helper: basename
function baseName(p){ return (p||'').split('/').pop().split('\\').pop(); }
function depthPath(p){ const s=(p||'').replace(/\\/g,'/'); return s.split('/').length-1; }

// percentiles
function percentile(sortedAsc, p){
  if(sortedAsc.length===0) return 0;
  const idx = Math.floor((p/100)*(sortedAsc.length-1));
  return sortedAsc[Math.min(sortedAsc.length-1, Math.max(0, idx))];
}
const fanOutVals = [...fanOut.values()].sort((a,b)=>a-b);
const fanInVals = [...fanIn.values()].sort((a,b)=>a-b);
const fanOutThresholdTop10 = percentile(fanOutVals, 90);
const fanInThresholdBottom25 = percentile(fanInVals, 25);

const entryFilenameCode = new Set([
  'index.ts','index.js','main.ts','main.js','app.ts','app.js','server.ts','server.js',
  'mod.rs','main.go','main.py','main.rs','manage.py','app.py','wsgi.py','asgi.py',
  'run.py','__main__.py','Application.java','Main.java','Program.cs','config.ru',
  'index.php','App.swift','Application.kt','main.cpp','main.c'
]);

// score entry points
const candidates = [];
for(const n of nodes){
  let score = 0;
  const fp = n.filePath || '';
  const bn = baseName(fp || n.name);
  if(n.type === 'document'){
    if(fp === 'README.md' || bn === 'README.md' && depthPath(fp)===0) score += 5;
    else if(depthPath(fp)===0 && bn.endsWith('.md')) score += 2;
  } else {
    // code files: only type file? score all non-doc maybe but filename matters
    if(n.type === 'file'){
      if(entryFilenameCode.has(bn)) score += 3;
      const d = depthPath(fp);
      if(d === 0 || d === 1) score += 1;
      if(fanOut.get(n.id) >= fanOutThresholdTop10) score += 1;
      if(fanIn.get(n.id) <= fanInThresholdBottom25) score += 1;
    }
  }
  if(score > 0){
    candidates.push({ id: n.id, score, name: n.name, summary: n.summary });
  }
}
candidates.sort((a,b) => b.score - a.score || (fanOut.get(b.id)||0) - (fanOut.get(a.id)||0));
const entryPointCandidates = candidates.slice(0,5);

// top code entry point for BFS: highest scoring candidate with type file (not document)
let bfsStart = null;
for(const c of entryPointCandidates){
  const n = nodeById.get(c.id);
  if(n && n.type === 'file'){ bfsStart = c.id; break; }
}
// fallback: first file node with max fanout
if(!bfsStart){
  const files = nodes.filter(n=>n.type==='file');
  if(files.length){ bfsStart = files.sort((a,b)=>(fanOut.get(b.id)||0)-(fanOut.get(a.id)||0))[0].id; }
}

// BFS following imports and calls edges forward
const bfsOrder = [];
const depthMap = {};
const byDepth = {};
if(bfsStart){
  const visited = new Set([bfsStart]);
  const q = [[bfsStart,0]];
  while(q.length){
    const [cur, d] = q.shift();
    bfsOrder.push(cur);
    depthMap[cur]=d;
    if(!byDepth[d]) byDepth[d]=[];
    byDepth[d].push(cur);
    // outgoing imports/calls
    const outs = outEdges.get(cur) || [];
    const nexts = outs.filter(e => (e.type==='imports' || e.type==='calls')).map(e=>e.target);
    for(const t of nexts){
      if(!visited.has(t) && nodeById.has(t)){
        visited.add(t);
        q.push([t, d+1]);
      }
    }
  }
}
const bfsTraversal = {
  startNode: bfsStart,
  order: bfsOrder,
  depthMap,
  byDepth
};

// fan-in ranking top 20
const fanInRanking = nodes
  .map(n => ({ id: n.id, fanIn: fanIn.get(n.id), name: n.name }))
  .sort((a,b)=> b.fanIn - a.fanIn || a.id.localeCompare(b.id))
  .slice(0,20);

const fanOutRanking = nodes
  .map(n => ({ id: n.id, fanOut: fanOut.get(n.id), name: n.name }))
  .sort((a,b)=> b.fanOut - a.fanOut || a.id.localeCompare(b.id))
  .slice(0,20);

// non-code files
const nonCodeFiles = { documentation: [], infrastructure: [], data: [], config: [] };
for(const n of nodes){
  const entry = { id: n.id, name: n.name, type: n.type, summary: n.summary };
  if(n.type === 'document') nonCodeFiles.documentation.push(entry);
  else if(['service','pipeline','resource'].includes(n.type)) nonCodeFiles.infrastructure.push(entry);
  else if(['table','schema','endpoint'].includes(n.type)) nonCodeFiles.data.push(entry);
  else if(n.type === 'config') nonCodeFiles.config.push(entry);
}

// clusters
// adjacency for imports/calls both directions
const impCallEdges = edges.filter(e => e.type==='imports' || e.type==='calls');
// set of pairs with edge
const edgeSet = new Set(impCallEdges.map(e => e.source + '->' + e.target));
function hasEdge(a,b){ return edgeSet.has(a+'->'+b); }
// seed bidirectional pairs
const seeds = [];
const nodeIds = nodes.map(n=>n.id);
for(let i=0;i<nodeIds.length;i++){
  for(let j=i+1;j<nodeIds.length;j++){
    const a=nodeIds[i], b=nodeIds[j];
    if(hasEdge(a,b) && hasEdge(b,a)){
      seeds.push([a,b]);
    }
  }
}
// expand each seed
function expandCluster(seed){
  const set = new Set(seed);
  let changed = true;
  while(changed){
    changed = false;
    for(const w of nodeIds){
      if(set.has(w)) continue;
      let cnt = 0;
      for(const m of set){
        // any edge between w and m (any type among all edges? use all edges)
        const e1 = edges.some(e => (e.source===w && e.target===m) || (e.source===m && e.target===w));
        if(e1) cnt++;
      }
      if(cnt >= 2){ set.add(w); changed = true; }
    }
  }
  return [...set];
}
const clustersRaw = [];
for(const s of seeds){
  const nodes = expandCluster(s);
  if(nodes.length >=2 && nodes.length <= 8){
    const ec = edges.filter(e => nodes.includes(e.source) && nodes.includes(e.target)).length;
    clustersRaw.push({ nodes, edgeCount: ec });
  }
}
// dedupe by sorted node set
const seen = new Set();
const clustersDedup = [];
for(const c of clustersRaw){
  const key = [...c.nodes].sort().join('|');
  if(seen.has(key)) continue;
  seen.add(key);
  clustersDedup.push(c);
}
clustersDedup.sort((a,b)=> b.edgeCount - a.edgeCount || b.nodes.length - a.nodes.length);
const clusters = clustersDedup.slice(0,10);

// node summary index
const nodeSummaryIndex = {};
for(const n of nodes){
  nodeSummaryIndex[n.id] = { name: n.name, type: n.type, summary: n.summary };
}

const result = {
  scriptCompleted: true,
  entryPointCandidates,
  fanInRanking,
  fanOutRanking,
  bfsTraversal,
  nonCodeFiles,
  clusters,
  layers: { count: layers.length, list: layers.map(l=>({id:l.id,name:l.name,description:l.description})) },
  nodeSummaryIndex,
  totalNodes: nodes.length,
  totalEdges: edges.length
};

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log('done', outputPath);
process.exit(0);
