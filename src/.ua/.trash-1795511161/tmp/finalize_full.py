import json
import os
import shutil
import sys
from datetime import datetime, timezone

ua = sys.argv[1]
inter = os.path.join(ua, 'intermediate')

cfg_path = os.path.join(ua, 'config.json')
cfg = {}
if os.path.exists(cfg_path):
    cfg = json.load(open(cfg_path, encoding='utf-8'))
cfg.update({'autoUpdate': True, 'outputLanguage': 'en'})
with open(cfg_path, 'w', encoding='utf-8') as f:
    json.dump(cfg, f, indent=2)
    f.write('\n')

graph = json.load(open(os.path.join(inter, 'assembled-graph.json'), encoding='utf-8'))
with open(os.path.join(ua, 'knowledge-graph.json'), 'w', encoding='utf-8') as f:
    json.dump(graph, f, ensure_ascii=False, indent=2)
    f.write('\n')

staged = os.path.join(inter, 'code-lessons.normalized.json')
if os.path.exists(staged):
    shutil.move(staged, os.path.join(ua, 'code-lessons.json'))

meta = {
    'lastAnalyzedAt': datetime.now(timezone.utc).isoformat(),
    'gitCommitHash': 'f380ff666b3b2f38a3363d50f0dd6493bbba3328',
    'version': '1.0.0',
    'analyzedFiles': len([n for n in graph['nodes'] if n.get('type') == 'file'])
}
with open(os.path.join(ua, 'meta.json'), 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=2)
    f.write('\n')

trash = os.path.join(ua, '.trash-' + str(int(datetime.now().timestamp())))
os.makedirs(trash, exist_ok=True)
for name in os.listdir(inter):
    if name == 'scan-result.json':
        continue
    src = os.path.join(inter, name)
    dst = os.path.join(trash, name)
    try:
        shutil.move(src, dst)
    except Exception:
        pass
tmp = os.path.join(ua, 'tmp')
if os.path.isdir(tmp):
    try:
        shutil.move(tmp, os.path.join(trash, 'tmp'))
    except Exception:
        pass
print('finalized', meta)
