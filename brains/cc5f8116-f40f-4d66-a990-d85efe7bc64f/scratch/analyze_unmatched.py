import json

target_file = r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json"
master_file = r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\master_matches.json"

with open(target_file, "r", encoding="utf-8") as f:
    targets = json.load(f)

with open(master_file, "r", encoding="utf-8") as f:
    matches = json.load(f)

unmatched = []
matched = []
for t in targets:
    r_str = str(t['row'])
    if r_str in matches and matches[r_str].get('status') == 'matched':
        matched.append((t, matches[r_str]))
    else:
        unmatched.append(t)

print(f"Total: {len(targets)} | Matched: {len(matched)} | Unmatched: {len(unmatched)}")

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\unmatched_132.txt", "w", encoding="utf-8") as out:
    out.write(f"Total Unmatched Companies: {len(unmatched)}\n\n")
    for idx, u in enumerate(unmatched):
        out.write(f"[{idx+1}] Row {u['row']} | 상호: {u['name']} | 대표: {u['ceo']} | 전화: {u['tel']} | 시군구: {u['sigungu']} | 주소: {u['addr']} | 업종: {u['industry']}\n")

print("Saved unmatched companies to scratch/unmatched_132.txt")
