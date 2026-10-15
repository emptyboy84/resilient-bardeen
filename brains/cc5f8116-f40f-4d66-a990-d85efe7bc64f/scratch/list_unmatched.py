import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    targets = json.load(f)
with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\master_matches.json", "r", encoding="utf-8") as f:
    matches = json.load(f)

unmatched = [t for t in targets if str(t['row']) not in matches or matches[str(t['row'])].get('status') != 'matched']
print(f"Total unmatched count: {len(unmatched)}")

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\unmatched_132_detail.json", "w", encoding="utf-8") as f:
    json.dump(unmatched, f, ensure_ascii=False, indent=2)

for i, u in enumerate(unmatched):
    print(f"{i+1:3d} | Row {u['row']:4d} | {u['name'][:20]:20s} | CEO: {u.get('ceo',''):8s} | Tel: {u.get('tel',''):13s} | Addr: {u.get('addr',''):35s}")
