import openpyxl
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"
wb = openpyxl.load_workbook(wb_path, read_only=True, data_only=True)
ws = wb["기업체 리스트"]

print("Detailed sample of rows with Q/R sales:")
count = 0
for row_idx, row in enumerate(ws.iter_rows(min_row=2, max_col=20, values_only=True), start=2):
    q = row[16]
    r = row[17]
    p = row[15]
    name = row[2]
    biz = row[3]
    if q is not None and isinstance(q, (int, float)) and q > 0:
        count += 1
        print(f"Row {row_idx:4d} | {str(name)[:18]:18s} | Biz: {biz} | P(종사자): {str(p):4s} | Q(24년매출): {q:14,d} | R(25년매출): {str(r)}")
        if count >= 15:
            break

wb.close()
