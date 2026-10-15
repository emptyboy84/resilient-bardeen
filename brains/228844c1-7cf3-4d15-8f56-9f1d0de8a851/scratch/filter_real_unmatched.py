import json

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/unmatched_rows.json', encoding='utf-8') as f:
    unmatched = json.load(f)

# Filter out empty rows (where name is empty)
real_unmatched = [r for r in unmatched if r['name'].strip() and r['row_idx'] <= 2314]
print(f"Real unmatched rows: {len(real_unmatched)}")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/real_unmatched_274.json', 'w', encoding='utf-8') as f:
    json.dump(real_unmatched, f, ensure_ascii=False, indent=2)

from collections import Counter
type_counts = Counter(r['type'] for r in real_unmatched)
print("Industry breakdown of 274 rows:")
for t, c in type_counts.most_common():
    print(f"  {t}: {c}")
