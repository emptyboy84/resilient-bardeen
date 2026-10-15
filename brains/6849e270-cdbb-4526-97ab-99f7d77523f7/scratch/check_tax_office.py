import openpyxl
import json
import re

final_excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사_DB_배현명_1000행_전수정제_최종완벽본.xlsx"
wb = openpyxl.load_workbook(final_excel_path, data_only=True)
ws = wb["실사DB_1000행_전수정제완료"]

tax_office_prefixes = [
    '051-810-', '051-310-', '051-620-', '051-740-', '051-240-',
    '051-559-', '051-580-', '051-460-', '051-780-'
]

suspicious_rows = []

for r in range(2, ws.max_row + 1):
    vals = [str(ws.cell(r, c).value or '').strip() for c in range(1, 19)]
    name = vals[2]
    biz_no = vals[3]
    ceo = vals[4]
    addr = vals[6]
    phone = vals[7]
    fax = vals[8]
    corp_no = vals[13]
    
    is_tax_office = False
    reasons = []
    
    # Check phone/fax
    for pfx in tax_office_prefixes:
        if phone.startswith(pfx):
            is_tax_office = True
            reasons.append(f"전화번호가 세무서 국번({pfx}): {phone}")
        if fax.startswith(pfx):
            is_tax_office = True
            reasons.append(f"팩스번호가 세무서 국번({pfx}): {fax}")
            
    # Check if '세무서' is in address or name
    if '세무서' in addr and '세무서' not in name:
        is_tax_office = True
        reasons.append(f"주소에 세무서 포함: {addr}")
        
    if is_tax_office:
        suspicious_rows.append((r, name, reasons))

print(f"Total suspicious tax office insertions found: {len(suspicious_rows)}")
for r, name, reasons in suspicious_rows:
    print(f"Row {r:4d}: {name:30s} -> {', '.join(reasons)}")
