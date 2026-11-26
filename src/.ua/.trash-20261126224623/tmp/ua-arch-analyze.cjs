const fs = require('fs');
const inputPath = process.argv[2];
const outPath = process.argv[3];
if (!inputPath || !outPath) { console.error('usage'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(inputPath,'utf8'));
const fileNodes = data.fileNodes;
const importEdges = data.importEdges || [];
const allEdges = data.allEdges || [];
const ids = fileNodes.map(n=>n.id);
const idSet = new Set(ids);
const nodeById = Object.fromEntries(fileNodes.map(n=>[n.id,n]));

// A. Directory grouping with common prefix
function commonPrefix(paths) {
  if (paths.length === 0) return '';
  // find common directory prefix
  const split = paths.map(p => p.split('/'));
  let prefix = [];
  const minLen = Math.min(...split.map(a=>a.length));
  for (let i=0;i<minLen;i++){
    const seg = split[0][i];
    if (split.every(a=>a[i]===seg)) prefix.push(seg); else break;
  }
  // if last segment is a file name, drop it (common prefix should end at dir)
  if (prefix.length>0) {
    // remove last if it's not a directory in original? We'll keep all common segments except possibly file
    // Heuristic: if all paths share full path except filename, prefix includes dirs only.
  }
  return prefix.join('/') + (prefix.length?'/':'');
}
const paths = fileNodes.map(n=>n.filePath);
const prefix = commonPrefix(paths);
// group by first segment after prefix
const groups = {};
for (const n of fileNodes) {
  let rel = n.filePath;
  if (prefix && rel.startsWith(prefix)) rel = rel.slice(prefix.length);
  const segs = rel.split('/').filter(Boolean);
  let group;
  if (segs.length <= 1) {
    // flat: group by extension pattern
    const name = segs[0] || n.filePath;
    if (/\.test\.|\.spec\.|test_|_test\.|_spec\./.test(name)) group='test';
    else if (/\.d\.ts$/.test(name)) group='types';
    else if (/\.config\./.test(name) || name==='tsconfig.json' || name==='package.json') group='config';
    else group='root';
  } else {
    group = segs[0];
  }
  if (!groups[group]) groups[group]=[];
  groups[group].push(n.id);
}
// If all in one group and flat, already handled.

// B. Node type grouping
const nodeTypeGroups = {};
for (const n of fileNodes) {
  const t = n.type;
  if (!nodeTypeGroups[t]) nodeTypeGroups[t]=[];
  nodeTypeGroups[t].push(n.id);
}

// C. Import adjacency
const fanOut = {}; const fanIn = {};
for (const id of ids) { fanOut[id]=0; fanIn[id]=0; }
const adj = {}; // from -> set to
for (const id of ids) adj[id]=new Set();
for (const e of importEdges) {
  if (!idSet.has(e.source) || !idSet.has(e.target)) continue;
  adj[e.source].add(e.target);
}
for (const id of ids) { fanOut[id]=adj[id].size; }
for (const e of importEdges) {
  if (!idSet.has(e.source) || !idSet.has(e.target)) continue;
  fanIn[e.target]=(fanIn[e.target]||0)+1;
}

// directory group of a node
function groupOf(id) {
  for (const [g,members] of Object.entries(groups)) if (members.includes(id)) return g;
  return 'root';
}
// group-level imports
const groupImports = {}; // fromGroup -> set toGroup
const groupImportCounts = {}; // "from->to" -> count
for (const gname of Object.keys(groups)) { groupImports[gname]=new Set(); }
for (const e of importEdges) {
  if (!idSet.has(e.source)||!idSet.has(e.target)) continue;
  const gf = groupOf(e.source); const gt = groupOf(e.target);
  if (gf!==gt) {
    groupImports[gf].add(gt);
    const key = gf+'->'+gt;
    groupImportCounts[key]=(groupImportCounts[key]||0)+1;
  }
}
// fan-in/fan-out per group
// D. Cross-category edges using allEdges
const crossMap = {};
for (const e of allEdges) {
  if (!idSet.has(e.source)||!idSet.has(e.target)) continue; // only file-level nodes? allEdges already file-level
  const fromType = nodeById[e.source].type;
  const toType = nodeById[e.target].type;
  const key = fromType+'->'+toType+'|'+e.type;
  crossMap[key] = (crossMap[key]||0)+1;
}
const crossCategoryEdges = Object.entries(crossMap).map(([k,v])=>{
  const [ft,rest] = k.split('->');
  const [tt,et] = rest.split('|');
  return {fromType:ft, toType:tt, edgeType:et, count:v};
});

// E. Inter-group import frequency
const interGroupImports = Object.entries(groupImportCounts).map(([k,v])=>{
  const [from,to]=k.split('->');
  return {from,to,count:v};
}).sort((a,b)=>b.count-a.count);

// F. Intra-group density
const intraGroupDensity = {};
for (const gname of Object.keys(groups)) {
  let internal=0; let total=0;
  for (const e of importEdges) {
    if (!idSet.has(e.source)||!idSet.has(e.target)) continue;
    const sIn = groups[gname].includes(e.source);
    const tIn = groups[gname].includes(e.target);
    const involves = sIn || tIn;
    if (!involves) continue;
    total++;
    if (sIn && tIn) internal++;
  }
  intraGroupDensity[gname] = { internalEdges: internal, totalEdges: total, density: total? internal/total : 0 };
}

// G. Pattern matching
const patternTable = [
  [/^(routes|api|controllers|endpoints|handlers|routers|controller|blueprints|serializers)$/,'api'],
  [/^(services|core|lib|domain|logic|internal|composables|mailers|jobs|channels|signals)$/,'service'],
  [/^(models|db|data|persistence|repository|entities|entity|migrations|sql|database|schema)$/,'data'],
  [/^(components|views|pages|ui|layouts|screens)$/,'ui'],
  [/^(middleware|plugins|interceptors|guards)$/,'middleware'],
  [/^(utils|helpers|common|shared|tools|pkg|templatetags)$/,'utility'],
  [/^(config|constants|env|settings)$/,'config'],
  [/^(__tests__|test|tests|spec|specs)$/,'test'],
  [/^(types|interfaces|schemas|contracts|dtos|dto|request|response)$/,'types'],
  [/^hooks$/,'hooks'],
  [/^(store|state|reducers|actions|slices)$/,'state'],
  [/^(assets|static|public)$/,'assets'],
  [/^(docs|documentation|wiki)$/,'documentation'],
  [/^(deploy|deployment|infra|infrastructure|docker|k8s|kubernetes|helm|charts|terraform|tf)$/,'infrastructure'],
];
function matchPattern(name) {
  const lower = name.toLowerCase();
  for (const [re,label] of patternTable) if (re.test(lower)) return label;
  // file-level patterns handled separately not needed for groups
  return null;
}
const patternMatches = {};
for (const gname of Object.keys(groups)) {
  const m = matchPattern(gname);
  if (m) patternMatches[gname]=m;
}
// file-level pattern for group? no.

// H. Deployment topology
const infraFiles = [];
let hasDockerfile=false,hasCompose=false,hasK8s=false,hasTerraform=false,hasCI=false;
for (const n of fileNodes) {
  const p = n.filePath.toLowerCase();
  const name = n.name.toLowerCase();
  if (name.startsWith('dockerfile')) { hasDockerfile=true; infraFiles.push(n.filePath); }
  if (name.startsWith('docker-compose')) { hasCompose=true; infraFiles.push(n.filePath); }
  if (p.includes('.github/workflows')||p.includes('.gitlab-ci')||name==='jenkinsfile') { hasCI=true; infraFiles.push(n.filePath); }
  if (p.includes('k8s')||p.includes('kubernetes')||p.includes('helm')||p.includes('charts')) { hasK8s=true; infraFiles.push(n.filePath); }
  if (name.endsWith('.tf')||name.endsWith('.tfvars')) { hasTerraform=true; infraFiles.push(n.filePath); }
}
const deploymentTopology = { hasDockerfile, hasCompose, hasK8s, hasTerraform, hasCI, infraFiles: [...new Set(infraFiles)] };

// I. Data pipeline
const schemaFiles=[];const migrationFiles=[];const dataModelFiles=[];const apiHandlerFiles=[];
for (const n of fileNodes) {
  const p=n.filePath.toLowerCase();
  if (p.endsWith('.sql')||p.endsWith('.graphql')||p.endsWith('.gql')||p.endsWith('.proto')||p.endsWith('.prisma')) schemaFiles.push(n.filePath);
  if (p.includes('migration')) migrationFiles.push(n.filePath);
  if (p.includes('model')) dataModelFiles.push(n.filePath);
  // api handlers: pattern groups api
}
// api handler files from groups with api pattern
for (const [gname,members] of Object.entries(groups)) {
  if (patternMatches[gname]==='api') apiHandlerFiles.push(...members.map(id=>nodeById[id].filePath));
}
const dataPipeline = { schemaFiles, migrationFiles, dataModelFiles, apiHandlerFiles };

// J. Doc coverage
let groupsWithDocs=0; const undocumentedGroups=[];
for (const gname of Object.keys(groups)) {
  const hasReadme = groups[gname].some(id=>nodeById[id].name.toLowerCase()==='readme.md');
  // docs files referencing? simple: group has md
  const hasMd = groups[gname].some(id=>nodeById[id].filePath.toLowerCase().endsWith('.md'));
  if (hasMd) groupsWithDocs++; else undocumentedGroups.push(gname);
}
const docCoverage = { groupsWithDocs, totalGroups: Object.keys(groups).length, coverageRatio: Object.keys(groups).length? groupsWithDocs/Object.keys(groups).length:0, undocumentedGroups };

// K. Dependency direction
const depDirection = [];
for (const key of Object.keys(groupImportCounts)) {
  const [from,to]=key.split('->');
  const reverse = to+'->'+from;
  const c1 = groupImportCounts[key];
  const c2 = groupImportCounts[reverse]||0;
  if (c1 > c2) depDirection.push({dependent: from, dependsOn: to});
}
// dedupe
const seen = new Set();
const dependencyDirection = depDirection.filter(d=>{
  const k=d.dependent+'->'+d.dependsOn;
  if (seen.has(k)) return false; seen.add(k); return true;
});

const result = {
  scriptCompleted: true,
  directoryGroups: groups,
  nodeTypeGroups,
  crossCategoryEdges,
  interGroupImports,
  intraGroupDensity,
  patternMatches,
  deploymentTopology,
  dataPipeline,
  docCoverage,
  dependencyDirection,
  fileStats: {
    totalFileNodes: fileNodes.length,
    filesPerGroup: Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,v.length])),
    nodeTypeCounts: Object.fromEntries(Object.entries(nodeTypeGroups).map(([k,v])=>[k,v.length]))
  },
  fileFanIn: Object.fromEntries(ids.map(id=>[id, fanIn[id]||0])),
  fileFanOut: Object.fromEntries(ids.map(id=>[id, fanOut[id]||0])),
  commonPrefix: prefix
};
fs.writeFileSync(outPath, JSON.stringify(result,null,2));
console.log('done');