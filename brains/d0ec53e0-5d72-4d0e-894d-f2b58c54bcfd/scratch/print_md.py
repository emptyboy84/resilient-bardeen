# -*- coding: utf-8 -*-
import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\lg\.gemini\antigravity\brain\d0ec53e0-5d72-4d0e-894d-f2b58c54bcfd\scratch\modified_companies.json", "r", encoding="utf-8") as f:
    d = json.load(f)

for idx, c in enumerate(d["recent_54"], 1):
    items_str = ", ".join([f"{k}: {v}" for k, v in c["items"]])
    print(f"| {idx} | 행 {c['row']} (순번 {c['seq']}) | **{c['name']}** | {c['bizno'] or '-'} | {c['rep'] or '-'} | {c['cat'] or '-'} | {items_str} |")