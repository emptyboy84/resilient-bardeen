import json
import sys

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\unmatched_132_detail.json", "r", encoding="utf-8") as f:
    unmatched = json.load(f)

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\unmatched_132_utf8.txt", "w", encoding="utf-8") as f:
    for i, u in enumerate(unmatched):
        line = f"{i+1:3d} | Row {u['row']:4d} | {u['name']:25s} | CEO: {u.get('ceo',''):10s} | Tel: {u.get('tel',''):14s} | Addr: {u.get('addr',''):35s}\n"
        f.write(line)

print("Saved 132 rows as utf-8 txt.")
