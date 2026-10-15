import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"
wb = openpyxl.load_workbook(wb_path, read_only=True, data_only=True)
ws = wb["기업체 리스트"]

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
    target_318_rows = set(t['row'] for t in json.load(f))

print("Target 318 rows that have sales data:")
for row_idx, row in enumerate(ws.iter_rows(min_row=2, max_col=20, values_only=True), start=2):
    if row_idx in target_318_rows:
        name = row[2]
        q_val = row[16] # 24년 매출액
        r_val = row[17] # 25년 매출액
        p_val = row[15] # 종사자수
        if q_val is not None or r_val is not None or p_val is not None:
            print(f"Row {row_idx:4d} | {str(name):25s} | Q(24년): {q_val} | R(25년): {r_val} | P(종사자): {p_val}")

wb.close()
