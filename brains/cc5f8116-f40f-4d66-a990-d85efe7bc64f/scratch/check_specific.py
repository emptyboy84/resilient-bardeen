import json

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_turbo_matches.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for r in ["2260", "2246", "2252", "2263", "504", "539"]:
    if r in data:
        print(f"Row {r}: {data[r]}")
