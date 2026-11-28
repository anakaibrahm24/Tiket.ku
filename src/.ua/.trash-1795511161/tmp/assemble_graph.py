import json
import sys
from datetime import datetime, timezone

base = sys.argv[1]
project_root = sys.argv[2]
commit_hash = sys.argv[3]
scan = json.load(open(base + '/scan-result.json', encoding='utf-8'))
graph = json.load(open(base + '/assembled-graph.json', encoding='utf-8'))
layers = json.load(open(base + '/layers.json', encoding='utf-8'))
tour = json.load(open(base + '/tour.normalized.json', encoding='utf-8'))
try:
    labels = json.load(open(base + '/container-labels.json', encoding='utf-8'))
except Exception:
    labels = []

if isinstance(layers, dict) and 'layers' in layers:
    layers = layers['layers']
node_ids = {n['id'] for n in graph['nodes']}
file_prefixes = ('file:', 'config:', 'document:', 'service:', 'pipeline:', 'table:', 'schema:', 'resource:', 'endpoint:')
normalized_layers = []
for layer in layers:
    if not isinstance(layer, dict):
        continue
    node_ids_list = layer.get('nodeIds')
    if node_ids_list is None and 'nodes' in layer:
        node_ids_list = layer['nodes']
    if node_ids_list is None:
        node_ids_list = []
    cleaned = []
    for nid in node_ids_list:
        if isinstance(nid, dict):
            nid = nid.get('id')
        if not isinstance(nid, str):
            continue
        if not nid.startswith(file_prefixes):
            nid = 'file:' + nid
        if nid in node_ids:
            cleaned.append(nid)
    lid = layer.get('id') or ('layer:' + str(layer.get('name', 'unnamed')).lower().replace(' ', '-'))
    normalized_layers.append({
        'id': lid,
        'name': layer.get('name') or lid,
        'description': layer.get('description') or '',
        'nodeIds': cleaned,
        'containerLabels': [lb for lb in next((l.get('labels', []) for l in labels if l.get('layerId') == lid), [])]
    })

normalized_tour = []
for step in tour:
    if not isinstance(step, dict):
        continue
    ids = [nid for nid in step.get('nodeIds', []) if nid in node_ids]
    s = {
        'order': step.get('order'),
        'title': step.get('title', ''),
        'description': step.get('description', ''),
        'nodeIds': ids
    }
    if 'languageLesson' in step:
        s['languageLesson'] = step['languageLesson']
    normalized_tour.append(s)
normalized_tour.sort(key=lambda s: s['order'])

out = {
    'version': '1.0.0',
    'project': {
        'name': scan.get('name') or 'project',
        'languages': scan.get('languages', []),
        'frameworks': scan.get('frameworks', []),
        'description': scan.get('description', ''),
        'analyzedAt': datetime.now(timezone.utc).isoformat(),
        'gitCommitHash': commit_hash
    },
    'nodes': graph['nodes'],
    'edges': graph['edges'],
    'layers': normalized_layers,
    'tour': normalized_tour
}
with open(base + '/assembled-graph.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(f'assembled graph: {len(out["nodes"])} nodes, {len(out["edges"])} edges, {len(normalized_layers)} layers, {len(normalized_tour)} tour steps')
