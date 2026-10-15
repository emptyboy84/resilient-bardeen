import json
from collections import Counter

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/unmatched_rows.json', encoding='utf-8') as f:
    unmatched = json.load(f)

lines = []
lines.append(f"Total unmatched: {len(unmatched)}")
type_counter = Counter(r['type'] for r in unmatched)
lines.append("\nBy Industry (업종):")
for t, c in type_counter.most_common():
    lines.append(f"  {t if t else '(공란)'}: {c}")

lines.append(f"\nRows with phone: {len([r for r in unmatched if r['phone']])} / {len(unmatched)}")
lines.append(f"Rows with addr: {len([r for r in unmatched if r['addr']])} / {len(unmatched)}")

lines.append("\nSamples by industry:")
for t in type_counter:
    samples = [f"{r['name']} (Row {r['row_idx']}, 순번 {r['순번']})" for r in unmatched if r['type'] == t][:8]
    lines.append(f"\n[{t if t else '(공란)'}]:\n  " + "\n  ".join(samples))

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/unmatched_summary.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Wrote summary to scratch/unmatched_summary.txt")
