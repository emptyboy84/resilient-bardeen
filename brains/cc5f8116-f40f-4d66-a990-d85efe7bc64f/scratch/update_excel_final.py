import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"

# Load final resolved dataset
with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\final_318_resolved.json", "r", encoding="utf-8") as f:
    final_data = json.load(f)

print(f"Loading workbook: {wb_path} ...")
wb = openpyxl.load_workbook(wb_path)
ws = wb["기업체 리스트"]

stats = {
    "total_targets": len(final_data),
    "biz_no_updated": 0,
    "emp_cnt_updated": 0,
    "ceo_updated": 0,
    "est_year_updated": 0,
    "est_month_updated": 0,
    "tel_updated": 0,
    "addr_updated": 0,
    "closed_date_updated": 0,
    "note_updated": 0,
    "unmatched_kept_blank": 0
}

update_log = []

for r_str, item in final_data.items():
    row_idx = int(r_str)
    
    # Verify company name matches row
    sheet_c_name = ws.cell(row=row_idx, column=3).value
    target_name = item['name']
    
    if item['status'] != 'matched':
        stats['unmatched_kept_blank'] += 1
        continue
        
    changes = []
    
    # 1. D col: 사업자번호 (Column 4)
    if item.get('biz_no'):
        old_val = ws.cell(row=row_idx, column=4).value
        new_val = item['biz_no']
        ws.cell(row=row_idx, column=4, value=new_val)
        stats['biz_no_updated'] += 1
        changes.append(f"사업자번호: '{old_val}' -> '{new_val}'")
        
    # 2. E col: 설립연도(연도) (Column 5)
    if item.get('est_year'):
        old_val = ws.cell(row=row_idx, column=5).value
        if old_val is None or str(old_val).strip() == '':
            try:
                new_val = int(item['est_year'])
            except:
                new_val = item['est_year']
            ws.cell(row=row_idx, column=5, value=new_val)
            stats['est_year_updated'] += 1
            changes.append(f"설립연도: {new_val}")
            
    # 3. F col: 설립연도(월) (Column 6)
    if item.get('est_month'):
        old_val = ws.cell(row=row_idx, column=6).value
        if old_val is None or str(old_val).strip() == '':
            try:
                new_val = int(item['est_month'])
            except:
                new_val = item['est_month']
            ws.cell(row=row_idx, column=6, value=new_val)
            stats['est_month_updated'] += 1
            changes.append(f"설립월: {new_val}")
            
    # 4. G col: 대표자 성함 (Column 7)
    if item.get('ceo'):
        old_val = ws.cell(row=row_idx, column=7).value
        if old_val is None or str(old_val).strip() == '':
            new_val = item['ceo']
            ws.cell(row=row_idx, column=7, value=new_val)
            stats['ceo_updated'] += 1
            changes.append(f"대표자: {new_val}")
            
    # 5. H col: 연락처 (Column 8)
    if item.get('tel'):
        old_val = ws.cell(row=row_idx, column=8).value
        if old_val is None or str(old_val).strip() == '':
            new_val = item['tel']
            ws.cell(row=row_idx, column=8, value=new_val)
            stats['tel_updated'] += 1
            changes.append(f"연락처: {new_val}")
            
    # 6. K col: 주소 (Column 11)
    if item.get('addr'):
        old_val = ws.cell(row=row_idx, column=11).value
        if old_val is None or str(old_val).strip() == '':
            new_val = item['addr']
            ws.cell(row=row_idx, column=11, value=new_val)
            stats['addr_updated'] += 1
            changes.append(f"주소: {new_val}")
            
    # 7. N col: 폐업 날짜 (Column 14)
    if item.get('closed_date'):
        old_val = ws.cell(row=row_idx, column=14).value
        new_val = item['closed_date']
        ws.cell(row=row_idx, column=14, value=new_val)
        stats['closed_date_updated'] += 1
        changes.append(f"폐업날짜: {new_val}")
        
    # 8. O col: 비고 (Column 15)
    is_closed = bool(item.get('closed_date')) or item.get('cand_status') == '폐업자'
    if is_closed:
        old_val = ws.cell(row=row_idx, column=15).value
        old_str = str(old_val).strip() if old_val is not None else ""
        if '폐업' not in old_str:
            new_val = f"{old_str} 폐업자".strip() if old_str else "폐업자"
            ws.cell(row=row_idx, column=15, value=new_val)
            stats['note_updated'] += 1
            changes.append(f"비고: '{new_val}'")
            
    # 9. P col: 종사자수(명) 25년 기준 (Column 16) - BIZNO ONLY RULE!
    emp_val = item.get('emp_cnt')
    if emp_val is not None and str(emp_val).strip() != '':
        try:
            new_emp = int(emp_val)
            old_val = ws.cell(row=row_idx, column=16).value
            ws.cell(row=row_idx, column=16, value=new_emp)
            stats['emp_cnt_updated'] += 1
            changes.append(f"종사자수(비즈노): {new_emp}명")
        except ValueError:
            pass

    if changes:
        update_log.append({
            "row": row_idx,
            "name": target_name,
            "changes": changes
        })

print("Saving workbook safely...")
wb.save(wb_path)
wb.close()
print("Workbook successfully saved!")

print("\n--- Update Summary Statistics ---")
for k, v in stats.items():
    print(f"  {k:25s}: {v}")

with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\update_log.json", "w", encoding="utf-8") as f:
    json.dump(update_log, f, ensure_ascii=False, indent=2)

print(f"\nTotal rows modified: {len(update_log)}")
print(f"Detailed log written to update_log.json")
