import openpyxl
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"
wb = openpyxl.load_workbook(wb_path, read_only=True, data_only=True)
ws = wb["기업체 리스트"]

q_zero = 0
q_nonzero = 0
q_str = 0
q_none = 0

r_zero = 0
r_nonzero = 0
r_str = 0
r_none = 0

for row in ws.iter_rows(min_row=2, max_col=18, values_only=True):
    if row[2] is None: continue
    
    q = row[16]
    r = row[17]
    
    if q is None:
        q_none += 1
    elif isinstance(q, (int, float)):
        if q == 0:
            q_zero += 1
        else:
            q_nonzero += 1
    else:
        q_str += 1
        
    if r is None:
        r_none += 1
    elif isinstance(r, (int, float)):
        if r == 0:
            r_zero += 1
        else:
            r_nonzero += 1
    else:
        r_str += 1

print(f"Q col (24년 매출액): None={q_none}, Zero={q_zero}, Non-zero numeric={q_nonzero}, String={q_str}")
print(f"R col (25년 매출액): None={r_none}, Zero={r_zero}, Non-zero numeric={r_nonzero}, String={r_str}")

wb.close()
