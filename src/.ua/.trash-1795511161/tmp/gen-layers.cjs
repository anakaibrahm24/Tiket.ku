const fs = require('fs');
const input = require('D:/naka/project/Tiket.ku_Fork_V.2/src/.ua/tmp/ua-arch-input.json');
const ids = input.fileNodes.map(n=>n.id);
const byId = Object.fromEntries(input.fileNodes.map(n=>[n.id,n]));

function layerFor(fp) {
  const p = fp;
  if (p.endsWith('.tsx') || p === 'App.tsx' || p === 'main.tsx') return 'ui';
  if (p.includes('/hooks/') || p.startsWith('hooks/')) return 'hooks';
  if (p.includes('/service/') || p.startsWith('services/')) return 'service';
  if (p === 'lib/supabase.ts') return 'service';
  if (p.includes('/types/') || p.includes('/schema/') || p.includes('/schemas/') || p.endsWith('.d.ts') || p === 'vite-env.d.ts' || p.endsWith('matchesProps.ts')) return 'types';
  if (p === 'lib/utiils.ts') return 'utility';
  if (p === 'app.css') return 'ui';
  return 'ui';
}

const layerDefs = {
  ui: { id:'layer:ui', name:'UI Layer', desc:'React components, pages, routing, and styling for the Tiket.ku interface.' },
  hooks: { id:'layer:hooks', name:'Hooks Layer', desc:'Custom React hooks for data fetching, form handling, and session state.' },
  service: { id:'layer:service', name:'Service Layer', desc:'Supabase-backed data access and business logic for events, orders, tickets, and auth.' },
  types: { id:'layer:types', name:'Types & Schemas', desc:'TypeScript types, Zod validation schemas, and environment declarations.' },
  utility: { id:'layer:utility', name:'Utility Layer', desc:'Shared helpers such as Tailwind class merging.' }
};

const buckets = { ui:[], hooks:[], service:[], types:[], utility:[] };
for (const id of ids) {
  const fp = byId[id].filePath;
  const l = layerFor(fp);
  buckets[l].push(id);
}

const out = Object.keys(layerDefs).map(k => ({
  id: layerDefs[k].id,
  name: layerDefs[k].name,
  description: layerDefs[k].desc,
  nodeIds: buckets[k]
})).filter(l=>l.nodeIds.length>0);

// verify
const total = out.reduce((a,l)=>a+l.nodeIds.length,0);
console.log('layers', out.length, 'total', total, 'expected', ids.length);
fs.writeFileSync('D:/naka/project/Tiket.ku_Fork_V.2/src/.ua/intermediate/layers.json', JSON.stringify(out,null,2));