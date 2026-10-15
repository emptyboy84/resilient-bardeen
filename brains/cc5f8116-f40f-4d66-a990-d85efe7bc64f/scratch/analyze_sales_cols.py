import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"
wb = openpyxl.load_workbook(wb_path, read_only=True, data_only=True)
ws = wb["기업체 리스트"]

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    target_318_rows = set(t['row'] for t in json.load(f))

q_non_empty = 0
r_non_empty = 0
target_q_non_empty = 0
target_r_non_empty = 0
q_samples = []
r_samples = []
total_rows = 0

for row_idx, row in enumerate(ws.iter_rows(min_row=2, max_col=20, values_only=True), start=2):
    c_val = row[2] # C col (사업체명)
    if c_val is None: continue
    total_rows += 1
    
    q_val = row[16] # Q col (24년 매출액(원))
    r_val = row[17] # R col (25년 매출액(원))
    
    if q_val is not None:
        q_non_empty += 1
        if len(q_samples) < 10:
            q_samples.append((row_idx, c_val, q_val))
        if row_idx in target_318_rows:
            target_q_non_empty += 1
            
    if r_val is not None:
        r_non_empty += 1
        if len(r_samples) < 10:
            r_samples.append((row_idx, c_val, r_val))
        if row_idx in target_318_rows:
            target_r_non_empty += 1

print(f"Total rows: {total_rows}")
print(f"Q col (24년 매출액(원)) non-empty: {q_non_empty} / {total_rows}")
print(f"R col (25년 매출액(원)) non-empty: {r_non_empty} / {total_rows}")
print(f"Target 318 rows: Q non-empty = {target_q_non_empty}, R non-empty = {target_r_non_empty}")

print("\n--- Samples of Q col (24년 매출액) ---")
for r, name, val in q_samples:
    print(f"Row {r:4d} | {name[:20]:20s} | Type: {type(val).__name__} | Value: {val}")

print("\n--- Samples of R col (25년 매출액) ---")
for r, name, val in r_samples:
    print(f"Row {r:4d} | {name[:20]:20s} | Type: {type(val).__name__} | Value: {val}")

wb.close()
