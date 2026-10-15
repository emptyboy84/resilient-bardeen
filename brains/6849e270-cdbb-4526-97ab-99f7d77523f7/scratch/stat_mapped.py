import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_1000_mapped.json', 'r', encoding='utf-8') as f:
    rows = json.load(f)

cols = ['author', 'note', 'name', 'biz_no', 'ceo', 'zip_c', 'addr', 'phone', 'fax', 'homepage', 'email', 'emp', 'nice_ind', 'corp_no', 'settle', 'ind_l', 'ind_m', 'ind_s']

col_empty_counts = {c: 0 for c in cols}

for r in rows:
    for c in cols:
        val = str(r.get(c) or '').strip()
        if not val:
            col_empty_counts[c] += 1

print("\n=== Accurately Mapped 1,000 Rows Column Stats ===")
for c, cnt in col_empty_counts.items():
    print(f"{c:12s}: {cnt:4d} empty ({100 - cnt/len(rows)*100:.1f}% filled)")
