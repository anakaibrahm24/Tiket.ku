import json
import sys
from datetime import datetime, timezone

base = sys.argv[1]
graph = json.load(open(base + '/assembled-graph.json', encoding='utf-8'))
tour = json.load(open(base + '/tour.normalized.json', encoding='utf-8'))
tour_orders = {step['order'] for step in tour}

file_level_types = {'file', 'config', 'document', 'service', 'pipeline', 'table', 'schema', 'resource', 'endpoint'}
nodes = [n for n in graph['nodes'] if n.get('type') in file_level_types]
node_by_path = {n.get('filePath'): n for n in nodes if n.get('filePath')}

merged = {}
warnings = []
for i in range(1, 5):
    d = json.load(open(f'{base}/code-lessons.detailed.{i}.json', encoding='utf-8'))
    files = d.get('files', d)
    for path, entry in files.items():
        if path in merged:
            warnings.append(f'duplicate key {path}')
            continue
        merged[path] = entry

output = {}
for path, entry in merged.items():
    if path not in node_by_path:
        continue
    node = node_by_path[path]
    e = dict(entry) if isinstance(entry, dict) else {}
    sections = []
    for s in e.get('sections', []) or []:
        lr = s.get('lineRange')
        if not (isinstance(lr, list) and len(lr) == 2 and all(isinstance(x, int) for x in lr) and 1 <= lr[0] <= lr[1]):
            continue
        sections.append(s)
        if len(sections) >= 10:
            break
    e['sections'] = sections
    if 'tourOrder' in e and e['tourOrder'] not in tour_orders:
        e.pop('tourOrder', None)
    if not e.get('overview'):
        e['overview'] = node.get('summary', '')
    output[path] = e

for path, node in node_by_path.items():
    if path not in output:
        output[path] = {'overview': node.get('summary', ''), 'sections': []}

out = {'version': 1, 'generatedAt': datetime.now(timezone.utc).isoformat(), 'files': output}
with open(base + '/code-lessons.normalized.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(f'normalized {len(output)} entries; warnings={len(warnings)}')
