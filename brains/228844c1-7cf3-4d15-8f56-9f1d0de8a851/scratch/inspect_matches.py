import json

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/master_matches.json', encoding='utf-8') as f:
    matches = json.load(f)

print('Total matches:', len(matches))
for m in matches[:25]:
    t = m['target']
    mst = m['master']
    print(f"Row {t['row_idx']} [{t['순번']}]: {t['name']} | Addr: {t['addr'][:20]} | Phone: {t['phone']}")
    print(f"  -> Matched ({m['matched_by']}): {mst['name']} | BNO: {mst['biz']} | Rep: {mst['rep']} | Est: {mst['est']} | Addr: {mst['addr'][:25]}")
    print("-" * 60)
