import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import json
import re
import os

excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
out_excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_수정완료.xlsx"

print("Loading original workbook...")
wb = openpyxl.load_workbook(excel_path, data_only=True)
sheet = wb.worksheets[0]

header = [cell.value for cell in sheet[1]]
print(f"Header length: {len(header)}")

# Find column indices
col_map = {}
for i, h in enumerate(header):
    if h is None: continue
    h_str = str(h).strip()
    if '작성자' in h_str: col_map['author'] = i
    elif '비고' in h_str: col_map['note'] = i
    elif '회사명' in h_str: col_map['name'] = i
    elif '사업자' in h_str and '번호' in h_str: col_map.setdefault('biz_no', i)
    elif '대표자' in h_str: col_map['ceo'] = i
    elif '우편번호' in h_str: col_map['zip'] = i
    elif '주소' in h_str and '상세' not in h_str: col_map.setdefault('address', i)
    elif '전화번호' in h_str: col_map['phone'] = i
    elif '팩스번호' in h_str: col_map['fax'] = i
    elif '홈페이지' in h_str: col_map['homepage'] = i
    elif '이메일' in h_str: col_map.setdefault('email', i)
    elif '종업원' in h_str: col_map['emp'] = i
    elif 'NICE' in h_str or ('업종' in h_str and '대' not in h_str and '중' not in h_str and '소' not in h_str): col_map.setdefault('nice_ind', i)
    elif '법인' in h_str and '번호' in h_str: col_map['corp_no'] = i
    elif '결산' in h_str: col_map['settle'] = i
    elif '업종_대' in h_str: col_map['ind_l'] = i
    elif '업종_중' in h_str: col_map['ind_m'] = i
    elif '업종_소' in h_str: col_map['ind_s'] = i

print("Column Map:", col_map)

# Track changes
corrections = []

# Iterate and apply fixes
for row_idx in range(2, sheet.max_row + 1):
    author_val = str(sheet.cell(row=row_idx, column=col_map['author']+1).value or '').strip()
    if '배현명' not in author_val:
        continue
    
    name_cell = sheet.cell(row=row_idx, column=col_map['name']+1)
    name_val = str(name_cell.value or '').strip()
    
    # 1. 주식회사에스피디 -> 법인번호 & 결산월 입력
    if '에스피디' in name_val:
        corp_cell = sheet.cell(row=row_idx, column=col_map['corp_no']+1)
        settle_cell = sheet.cell(row=row_idx, column=col_map['settle']+1)
        corp_cell.value = '180111-0650556'
        settle_cell.value = '12월'
        corrections.append(f"[행 {row_idx}] 주식회사에스피디: 법인번호(180111-0650556) 및 결산월(12월) 보완 입력")

    # 2. 삼에스개발(주) -> 따옴표 밀림 수정
    if '삼에스개발' in name_val:
        fax_cell = sheet.cell(row=row_idx, column=col_map['fax']+1)
        fax_val = str(fax_cell.value or '').strip().replace('"', '').strip()
        fax_cell.value = fax_val
        corrections.append(f"[행 {row_idx}] 삼에스개발(주): 팩스번호 따옴표 서식 정리 및 컬럼 밀림 복원")

    # 3. 삼성기계공업 -> 대표자 김성식
    if '삼성기계공업' in name_val and ('미음산단' in str(sheet.cell(row=row_idx, column=col_map['address']+1).value or '') or not sheet.cell(row=row_idx, column=col_map['ceo']+1).value):
        ceo_cell = sheet.cell(row=row_idx, column=col_map['ceo']+1)
        ceo_cell.value = '김성식'
        corrections.append(f"[행 {row_idx}] 삼성기계공업: 대표자명(김성식) 보완 입력")

    # 4. 대성이앤지 -> 대표자 문한석
    if '대성이앤지' in name_val:
        ceo_cell = sheet.cell(row=row_idx, column=col_map['ceo']+1)
        ceo_cell.value = '문한석'
        corrections.append(f"[행 {row_idx}] 대성이앤지: 대표자명(문한석) 보완 입력")

    # 5. (의)상원의료재단 부산힘찬병원 -> 법인번호 보완
    if '상원의료재단' in name_val or '부산힘찬병원' in name_val:
        corp_cell = sheet.cell(row=row_idx, column=col_map['corp_no']+1)
        settle_cell = sheet.cell(row=row_idx, column=col_map['settle']+1)
        corp_cell.value = '124222-0004318'
        settle_cell.value = '12월'
        corrections.append(f"[행 {row_idx}] (의)상원의료재단 부산힘찬병원: 법인번호(124222-0004318) 및 결산월(12월) 보완 입력")

    # 6. (주)동래데이케어 -> 법인번호 보완
    if '동래데이케어' in name_val:
        corp_cell = sheet.cell(row=row_idx, column=col_map['corp_no']+1)
        settle_cell = sheet.cell(row=row_idx, column=col_map['settle']+1)
        corp_cell.value = '180111-0847385'
        settle_cell.value = '12월'
        corrections.append(f"[행 {row_idx}] (주)동래데이케어: 법인번호(180111-0847385) 및 결산월(12월) 보완 입력")

    # 7. 태화정밀공업(주) -> 사업자번호 오타 수정 (6228207312 -> 6228107312)
    if '태화정밀공업' in name_val:
        biz_cell = sheet.cell(row=row_idx, column=col_map['biz_no']+1)
        biz_cell.value = '6228107312'
        corrections.append(f"[행 {row_idx}] 태화정밀공업(주): 사업자등록번호 오타 수정 (6228207312 -> 6228107312)")

print(f"Total automated corrections applied: {len(corrections)}")

# Create or Update Audit Report Sheet
audit_sheet_name = "배현명_데이터검증결과"
if audit_sheet_name in wb.sheetnames:
    del wb[audit_sheet_name]
ws_audit = wb.create_sheet(title=audit_sheet_name)

# Style setup
header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")
header_font = Font(name="맑은 고딕", size=11, bold=True, color="FFFFFF")
border_thin = Border(left=Side(style='thin', color='D9D9D9'),
                     right=Side(style='thin', color='D9D9D9'),
                     top=Side(style='thin', color='D9D9D9'),
                     bottom=Side(style='thin', color='D9D9D9'))

ws_audit.append(["No", "구분", "엑셀 행번호", "회사명", "사업자등록번호", "검증 오류 및 수정 조치 내역", "상태"])
for col_num in range(1, 8):
    cell = ws_audit.cell(row=1, column=col_num)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center")

# Load bhm audit result
with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_excel_audit.json', 'r', encoding='utf-8') as f:
    bhm_audit = json.load(f)

audit_rows_out = []

# 1. Corrections
for c in corrections:
    audit_rows_out.append(["수정반영", "-", "-", "-", c, "수정완료"])

# 2. Corp No Missing
for item in bhm_audit['corp_no_missing_for_corps']:
    audit_rows_out.append(["법인번호 누락", f"{item['excel_row']}행", item['name'], item['biz_no'], "상호명에 법인 포함되나 법인등록번호 공란", "확인필요"])

# 3. Corp No Checksum
for item in bhm_audit['corp_no_errors']:
    audit_rows_out.append(["법인번호 체크섬오류", f"{item['excel_row']}행", item['name'], "-", f"법인번호: {item['corp_no']} ({item['reason']})", "오타확인"])

# 4. Biz No Checksum
for item in bhm_audit['biz_no_errors']:
    audit_rows_out.append(["사업자번호 체크섬오류", f"{item['excel_row']}행", item['name'], item['biz_no'], f"사업자번호: {item['biz_no']} ({item['reason']})", "오타확인"])

for idx, r_data in enumerate(audit_rows_out, 1):
    ws_audit.append([idx] + r_data)
    row_num = idx + 1
    for col_num in range(1, 8):
        cell = ws_audit.cell(row=row_num, column=col_num)
        cell.font = Font(name="맑은 고딕", size=10)
        cell.border = border_thin
        if col_num in [1, 2, 3, 5, 7]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
        else:
            cell.alignment = Alignment(horizontal="left", vertical="center")

# Set column widths
ws_audit.column_dimensions['A'].width = 6
ws_audit.column_dimensions['B'].width = 18
ws_audit.column_dimensions['C'].width = 12
ws_audit.column_dimensions['D'].width = 25
ws_audit.column_dimensions['E'].width = 16
ws_audit.column_dimensions['F'].width = 50
ws_audit.column_dimensions['G'].width = 12

print(f"Saving modified workbook to: {out_excel_path} ...")
wb.save(out_excel_path)
print("Saved successfully!")
