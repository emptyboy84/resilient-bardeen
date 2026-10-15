import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\master_matches.json", "r", encoding="utf-8") as f:
    matches = json.load(f)

print(f"Total entries in master_matches: {len(matches)}")
matched = [v for v in matches.values() if v.get('status') == 'matched']
print(f"Matched entries: {len(matched)}")

# Check sources
sources = {}
for m in matched:
    s = m.get('source', 'unknown')
    sources[s] = sources.get(s, 0) + 1
print("Sources:", sources)

# Check if any have mismatched names
for m in matched:
    c_name = m.get('name', '')
    biz = m.get('biz_no', '')
    src = m.get('source', '')
    if src == 'bizno_resolved':
        print(f"Row {m['row']}: target={c_name}, biz={biz}")
