import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_1000_mapped.json', 'r', encoding='utf-8') as f:
    rows = json.load(f)

for r in rows:
    if '양석엔지니어링' in r['name']:
        print(f"Row {r['local_id']} (Master {r['master_row']}):")
        for k, v in r.items():
            print(f"  {k}: {v}")
