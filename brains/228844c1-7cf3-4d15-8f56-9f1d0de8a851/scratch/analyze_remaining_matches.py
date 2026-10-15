import json

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/master_matches.json', encoding='utf-8') as f:
    matches = json.load(f)

# Filter for row_idx >= 1091
remaining_matches = [m for m in matches if m['target']['row_idx'] >= 1091]
print(f"Matches for rows >= 1091: {len(remaining_matches)} out of 500 empty rows")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/remaining_master_matches.json', 'w', encoding='utf-8') as f:
    json.dump(remaining_matches, f, ensure_ascii=False, indent=2)

for m in remaining_matches[:10]:
    t = m['target']
    mst = m['master']
    print(f"Row {t['row_idx']} [{t['순번']}]: {t['name']} | BNO: {mst['biz']} | Rep: {mst['rep']} | Addr: {mst['addr']}")
