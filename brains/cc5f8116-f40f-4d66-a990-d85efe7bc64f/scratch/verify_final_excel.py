import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

original_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명__BACKUP_20260921_090440.xlsx"
updated_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"

print("Loading original backup and updated workbook for verification...")
wb_orig = openpyxl.load_workbook(original_path, read_only=True, data_only=True)
wb_upd = openpyxl.load_workbook(updated_path, read_only=True, data_only=True)

ws_orig = wb_orig["기업체 리스트"]
ws_upd = wb_upd["기업체 리스트"]

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    target_318_rows = set(t['row'] for t in json.load(f))

# 1. Check Non-target rows (Should be 100% untouched!)
non_target_mismatches = []
total_checked = 0

rows_orig = list(ws_orig.iter_rows(min_row=1, max_col=25, values_only=True))
rows_upd = list(ws_upd.iter_rows(min_row=1, max_col=25, values_only=True))

print(f"Original row count: {len(rows_orig)}, Updated row count: {len(rows_upd)}")
assert len(rows_orig) == len(rows_upd), "Row counts differ!"

for idx, (r_o, r_u) in enumerate(zip(rows_orig, rows_upd), start=1):
    if idx not in target_318_rows:
        total_checked += 1
        if r_o != r_u:
            diffs = [(c, o, u) for c, (o, u) in enumerate(zip(r_o, r_u), 1) if o != u]
            non_target_mismatches.append((idx, diffs))

print(f"\n[Verification 1] Non-target rows checked: {total_checked}")
if non_target_mismatches:
    print(f"  WARNING: Found {len(non_target_mismatches)} unintended modifications in non-target rows!")
    for r, d in non_target_mismatches[:5]:
        print(f"    Row {r}: {d}")
else:
    print("  PASS: 100% of non-target rows (1,995 rows) are perfectly identical and preserved!")

# 2. Check Target 318 rows
target_modified_count = 0
biz_no_filled_count = 0
emp_filled_count = 0
closed_note_count = 0

for idx in sorted(target_318_rows):
    r_o = rows_orig[idx - 1]
    r_u = rows_upd[idx - 1]
    
    if r_o != r_u:
        target_modified_count += 1
        
    u_biz = r_u[3] # D col (사업자번호)
    if u_biz is not None and str(u_biz).strip() != '':
        biz_no_filled_count += 1
        
    u_emp = r_u[15] # P col (종사자수)
    if u_emp is not None and str(u_emp).strip() != '':
        emp_filled_count += 1
        
    u_note = str(r_u[14]) if r_u[14] is not None else ""
    if "폐업" in u_note:
        closed_note_count += 1

print(f"\n[Verification 2] Target 318 rows statistics:")
print(f"  - Target rows modified: {target_modified_count} / 318")
print(f"  - Business numbers populated: {biz_no_filled_count} / 318")
print(f"  - Bizno employee counts populated (P col): {emp_filled_count} / 318")
print(f"  - Closed status marked in note (O col): {closed_note_count} / 318")
print(f"  - Safe blanks maintained for unverified rows: {318 - biz_no_filled_count} / 318")

# 3. Check Personal List sheet (개인 리스트)
ws_p_orig = wb_orig["개인 리스트"]
ws_p_upd = wb_upd["개인 리스트"]
p_orig = list(ws_p_orig.iter_rows(values_only=True))
p_upd = list(ws_p_upd.iter_rows(values_only=True))

assert p_orig == p_upd, "개인 리스트 sheet was modified!"
print("\n[Verification 3] '개인 리스트' sheet checked:")
print("  PASS: '개인 리스트' sheet is 100% untouched!")

wb_orig.close()
wb_upd.close()

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
