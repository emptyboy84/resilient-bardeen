import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_1000_raw.json', 'r', encoding='utf-8') as f:
    rows = json.load(f)

print(f"Total rows: {len(rows)}")

cols = ['author', 'note', 'name', 'biz_no', 'ceo', 'zip_c', 'addr', 'phone', 'fax', 'homepage', 'email', 'emp', 'nice_ind', 'corp_no', 'settle', 'ind_l', 'ind_m', 'ind_s']

col_empty_counts = {c: 0 for c in cols}

for r in rows:
    for c in cols:
        val = str(r.get(c) or '').strip()
        if not val:
            col_empty_counts[c] += 1

print("\n=== Missing field counts across all 1,000 rows ===")
for c, cnt in col_empty_counts.items():
    print(f"{c:12s}: {cnt:4d} empty rows ({cnt/len(rows)*100:.1f}%)")

# List rows with any missing basic fields (ceo, addr, phone, corp_no, etc.)
rows_with_empty = []
for r in rows:
    empty_fields = [c for c in cols if not str(r.get(c) or '').strip() and c not in ['note', 'fax', 'email', 'homepage']]
    if empty_fields:
        rows_with_empty.append((r['local_id'], r['name'], empty_fields))

print(f"\nTotal rows with empty core fields (excluding optional note/fax/email/url): {len(rows_with_empty)}")
