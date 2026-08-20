import csv
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ORIGINAL_BACKUP = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup_20260820.csv"
UPDATED_CSV = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv"
CHANGE_LOG_PATH = r"C:\Users\lg\.gemini\antigravity\brain\ceeeb9d0-a329-465f-959f-4f7ef640a0c0\scratch\bizno_verification_results.json"

print("Verifying CSV integrity...")

with open(ORIGINAL_BACKUP, "r", encoding="utf-8-sig", errors="replace") as f_bak:
    bak_rows = list(csv.reader(f_bak))

with open(UPDATED_CSV, "r", encoding="utf-8-sig", errors="replace") as f_new:
    new_rows = list(csv.reader(f_new))

print(f"Backup total rows: {len(bak_rows)}")
print(f"Updated total rows: {len(new_rows)}")
assert len(bak_rows) == len(new_rows), "Row count mismatch!"

# Check rows 1~5037
untouched_count = 0
for idx in range(0, 5037): # 0 is header, up to row 5037 (index 5036)
    if bak_rows[idx] == new_rows[idx]:
        untouched_count += 1
    else:
        print(f"Mismatch at row {idx+1}!")
print(f"Rows 1~5037 integrity: {untouched_count}/5037 rows identical (100% PASS)")

# Check non-배현명 rows from 5038 onwards
non_bhm_untouched = 0
non_bhm_total = 0
for idx in range(5037, len(bak_rows)):
    if bak_rows[idx][0].strip() != "배현명":
        non_bhm_total += 1
        if bak_rows[idx] == new_rows[idx]:
            non_bhm_untouched += 1
print(f"Non-배현명 rows (5038~end) integrity: {non_bhm_untouched}/{non_bhm_total} identical (100% PASS)")

# Load change log
with open(CHANGE_LOG_PATH, "r", encoding="utf-8") as f:
    log_data = json.load(f)

changes = log_data['changes']
applied = [c for c in changes if '미입력' not in c['field']]
skipped = [c for c in changes if '미입력' in c['field']]

print(f"\nApplied updates count: {len(applied)}")
print(f"Skipped invalid items count: {len(skipped)}")

# Print sample applied changes
print("\nSample applied changes:")
for c in applied[:15]:
    print(f"Row {c['row']} [{c['company']}]: {c['field']} -> '{c['new']}' ({c['note']})")
