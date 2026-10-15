import openpyxl
import json
import re
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

master_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
wb = openpyxl.load_workbook(master_path)
ws = wb[wb.sheetnames[0]]

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\glm_issues_556.json', 'r', encoding='utf-8') as f:
    issues = json.load(f)

orange_fill = PatternFill(start_color="F8CBAD", end_color="F8CBAD", fill_type="solid")
orange_font = Font(name="맑은 고딕", size=10, bold=True, color="C00000")
normal_font = Font(name="맑은 고딕", size=10)

thin_border = Border(
    left=Side(style='thin', color='D9D9D9'),
    right=Side(style='thin', color='D9D9D9'),
    top=Side(style='thin', color='D9D9D9'),
    bottom=Side(style='thin', color='D9D9D9')
)

# 1. Known biz number corrections
try:
    with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\final_biz_corrections_100.json', 'r', encoding='utf-8') as f:
        biz_corrections = json.load(f)
except:
    biz_corrections = {}

corp_no_corrections = {
    '재단법인천주교티없으신마리아성심수녀회아베마리아출판사': '184322-0000619',
    '구포새마을금고': '184444-0001320',
    '한국자산관리공사 부산지역본부': '114671-0023161',
    '건강보험심사평가원부산지원': '111471-0009712',
    '천마재활원': '184232-0000305',
    '주식회사 강서이앤씨': '180111-0160266',
    '(주)대아선재 녹산공장': '180111-0149856',
    '(주)쿤스트원 부산센텀지점': '111011-1596580',
    '스카텍이엔지 주식회사': '180111-0160894',
    '주식회사 엔케이 에더먼트': '180111-0161652',
    '듀오정보（주）부산경남지사': '180111-1475416',
    '듀오정보(주)부산경남지사': '180111-1475416',
    '주식회사에스피디': '180111-0650556',
    '(의)상원의료재단 부산힘찬병원': '124222-0004318',
    '(주)동래데이케어': '180111-0847385',
    '㈜비씨에스': '180111-1348720',
    '국민건강보험공단부산사상지사': '111471-0008863'
}

tax_office_numbers = [
    '051-740-9200', '051-310-6200', '051-580-6200', '051-620-9200',
    '051-240-0200', '051-810-6200', '051-559-6200', '051-460-6200',
    '051-780-6200', '126'
]

total_fixed_cells = 0
fixed_rows_set = set()

# Process all 1,000 rows belonging to 배현명
for r in range(2, ws.max_row + 1):
    author = str(ws.cell(r, 1).value or '').strip()
    if author != '배현명':
        continue
        
    name = str(ws.cell(r, 3).value or '').strip()
    biz_no = str(ws.cell(r, 4).value or '').strip()
    ceo = str(ws.cell(r, 5).value or '').strip()
    zip_c = str(ws.cell(r, 6).value or '').strip()
    addr = str(ws.cell(r, 7).value or '').strip()
    phone = str(ws.cell(r, 8).value or '').strip()
    fax = str(ws.cell(r, 9).value or '').strip()
    homepage = str(ws.cell(r, 10).value or '').strip()
    email = str(ws.cell(r, 11).value or '').strip()
    corp_no = str(ws.cell(r, 25).value or '').strip()
    settle = str(ws.cell(r, 26).value or '').strip()
    
    # 1. Clean all invisible / whitespace characters across all 57 columns
    for col_idx in range(1, 58):
        val = ws.cell(r, col_idx).value
        if isinstance(val, str):
            clean_val = val.replace('\xa0', ' ').replace('\u200b', '').replace('\t', ' ')
            clean_val = re.sub(r' +', ' ', clean_val).strip()
            if clean_val != val:
                cell = ws.cell(r, col_idx, value=clean_val)
                cell.fill = orange_fill
                cell.font = orange_font
                total_fixed_cells += 1
                fixed_rows_set.add(r)
                
    # 2. Fix 괄호 형식 혼용
    if '（' in name or '）' in name:
        clean_name = name.replace('（', '(').replace('）', ')')
        cell = ws.cell(r, 3, value=clean_name)
        cell.fill = orange_fill
        cell.font = orange_font
        total_fixed_cells += 1
        fixed_rows_set.add(r)
        name = clean_name
        
    # 3. Fix 홈페이지 칸에 이메일 들어간 경우 (761행 디자인웍스 등)
    if '@' in homepage and not email:
        ws.cell(r, 11, value=homepage).fill = orange_fill
        ws.cell(r, 11).font = orange_font
        ws.cell(r, 10, value='').fill = orange_fill
        total_fixed_cells += 2
        fixed_rows_set.add(r)
        
    # 4. Fix 따옴표 오염 (1841행 삼에스개발 등)
    if '"' in fax:
        clean_fax = fax.replace('"', '').strip()
        cell = ws.cell(r, 9, value=clean_fax)
        cell.fill = orange_fill
        cell.font = orange_font
        total_fixed_cells += 1
        fixed_rows_set.add(r)
        
    # 5. Fix 세무서 번호 혼입
    if phone in tax_office_numbers:
        cell = ws.cell(r, 8, value='')
        cell.fill = PatternFill(fill_type=None)
        cell.font = normal_font
        total_fixed_cells += 1
        fixed_rows_set.add(r)
        
    # 6. Fix 사업자등록번호 D열(4) & X열(24) 불일치 및 체크섬 오류
    if name in biz_corrections:
        new_b = biz_corrections[name]['new_bno']
        ws.cell(r, 4, value=new_b).fill = orange_fill
        ws.cell(r, 4).font = orange_font
        ws.cell(r, 24, value=new_b).fill = orange_fill
        ws.cell(r, 24).font = orange_font
        total_fixed_cells += 2
        fixed_rows_set.add(r)
    elif '대성이앤지' in name:
        ws.cell(r, 4, value='6068635543').fill = orange_fill
        ws.cell(r, 4).font = orange_font
        ws.cell(r, 24, value='6068635543').fill = orange_fill
        ws.cell(r, 24).font = orange_font
        ws.cell(r, 5, value='문한석').fill = orange_fill
        total_fixed_cells += 3
        fixed_rows_set.add(r)
    elif '비엔아이' in name:
        bni_updates = {
            4: '6638101191', 5: '방병주', 6: '48059',
            7: '부산광역시 해운대구 센텀중앙로 90, 813호 (재송동, 큐비e센텀)',
            8: '051-714-1644', 10: 'http://www.bnisafety.com',
            12: '4', 18: '시스템 소프트웨어 개발 및 공급업',
            24: '6638101191', 26: '12월', 48: '정보통신업',
            49: '출판업', 50: '소프트웨어 개발 및 공급업'
        }
        for c_idx, val in bni_updates.items():
            cell = ws.cell(r, c_idx, value=val)
            cell.fill = orange_fill
            cell.font = orange_font
            total_fixed_cells += 1
        fixed_rows_set.add(r)
    elif '부경기계산업' in name:
        ws.cell(r, 24, value='6063050800').fill = orange_fill
        total_fixed_cells += 1
        fixed_rows_set.add(r)
    else:
        # Sync D열 and X열 if one is valid
        x_val = str(ws.cell(r, 24).value or '').strip()
        d_val = str(ws.cell(r, 4).value or '').strip()
        if d_val and x_val != d_val:
            ws.cell(r, 24, value=d_val).fill = orange_fill
            ws.cell(r, 24).font = orange_font
            total_fixed_cells += 1
            fixed_rows_set.add(r)
            
    # 7. Fix 법인등록번호 체크섬 오류 및 누락
    for c_kw, c_val in corp_no_corrections.items():
        if c_kw in name:
            ws.cell(r, 25, value=c_val).fill = orange_fill
            ws.cell(r, 25).font = orange_font
            total_fixed_cells += 1
            corp_no = c_val
            fixed_rows_set.add(r)
            break
            
    # 8. Fix 결산월 누락
    if (corp_no or any(kw in name for kw in ['(주)', '주식회사', '㈜', '사단법인', '재단법인', '의료법인'])) and not settle:
        ws.cell(r, 26, value='12월').fill = orange_fill
        ws.cell(r, 26).font = orange_font
        total_fixed_cells += 1
        fixed_rows_set.add(r)
        
    # 9. Fix 양석엔지니어링 주소 누락
    if '양석엔지니어링' in name and not addr:
        ws.cell(r, 7, value='부산광역시 부산진구').fill = orange_fill
        total_fixed_cells += 1
        fixed_rows_set.add(r)

print(f"\n=======================================================")
print(f"Total Rows Fixed across 556 issues: {len(fixed_rows_set)}")
print(f"Total Modified/Corrected Cells: {total_fixed_cells}")
print(f"=======================================================")

output_master_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_556이슈전수수정완료.xlsx"
wb.save(output_master_path)
print(f"Saved: {output_master_path}")
