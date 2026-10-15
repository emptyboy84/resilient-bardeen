import openpyxl

file_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"
wb = openpyxl.load_workbook(file_path, data_only=True)
ws = wb["기업체 리스트"]

headers = [ws.cell(1, col).value for col in range(1, ws.max_column + 1)]

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\sample_missing.txt", "w", encoding="utf-8") as out:
    # Check blank rows at end
    blank_rows = 0
    non_blank_rows = 0
    missing_biz_no_rows = []
    has_biz_no_missing_emp = []
    
    for r in range(2, ws.max_row + 1):
        vals = [ws.cell(r, c).value for c in range(1, ws.max_column + 1)]
        if not any(v is not None and str(v).strip() != "" for v in vals):
            blank_rows += 1
            continue
        
        non_blank_rows += 1
        gubun = vals[0]
        seq = vals[1]
        name = vals[2]
        biz_no = vals[3]
        emp = vals[15] # 종사자수
        
        if not biz_no or str(biz_no).strip() == "":
            missing_biz_no_rows.append((r, gubun, seq, name, vals[6], vals[7], vals[10])) # row, gubun, seq, name, ceo, tel, addr
        else:
            if not emp or str(emp).strip() == "":
                has_biz_no_missing_emp.append((r, name, biz_no))
                
    out.write(f"Blank rows: {blank_rows}, Non-blank rows: {non_blank_rows}\n")
    out.write(f"Rows missing 사업자번호: {len(missing_biz_no_rows)}\n")
    out.write(f"Rows with 사업자번호 but missing 종사자수: {len(has_biz_no_missing_emp)}\n\n")
    
    out.write("--- Sample of Rows Missing 사업자번호 (First 20) ---\n")
    for r, gubun, seq, name, ceo, tel, addr in missing_biz_no_rows[:20]:
        out.write(f"Row {r} | 구분: {gubun} | 순번: {seq} | 상호: {name} | 대표: {ceo} | 전화: {tel} | 주소: {addr}\n")
        
    out.write("\n--- Sample of Rows Missing 사업자번호 (Last 20) ---\n")
    for r, gubun, seq, name, ceo, tel, addr in missing_biz_no_rows[-20:]:
        out.write(f"Row {r} | 구분: {gubun} | 순번: {seq} | 상호: {name} | 대표: {ceo} | 전화: {tel} | 주소: {addr}\n")
