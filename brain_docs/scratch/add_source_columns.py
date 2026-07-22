import sys
import re
import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment

sys.stdout.reconfigure(encoding='utf-8')

f1 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720.xlsx'
f2 = r'C:\Users\Administrator\Desktop\배현명만세.xlsx'
f2_alt = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명만세.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")

def normalize_val(val, col_name=""):
    if val is None:
        return ""
    val_str = str(val).strip()
    if val_str == "" or val_str == "-":
        return ""
    col_name = str(col_name)
    if any(k in col_name for k in ['전화', '팩스', '사업자', '우편', '번호', '일자', '일']):
        clean_num = re.sub(r'[^0-9]', '', val_str)
        if clean_num:
            return clean_num
    if val_str.endswith('.0'):
        val_str = val_str[:-2]
    val_str = re.sub(r'\s+', ' ', val_str)
    return val_str

print("1. 엑셀 파일 및 원본 대조 로딩 중...")
wb1 = openpyxl.load_workbook(f1, data_only=True, read_only=True)
wb2 = openpyxl.load_workbook(f2)

s1 = wb1['기업 정보']
s2 = wb2['기업 정보']

max_c = 60
s1_rows = list(s1.iter_rows(max_col=max_c, values_only=True))
headers1 = [str(h).strip() if h is not None else "" for h in s1_rows[0]]

# f2의 기존 헤더 구하기
headers2_cells = list(s2.iter_rows(min_row=1, max_row=1, max_col=max_c))[0]
headers2 = [str(cell.value).strip() if cell.value is not None else "" for cell in headers2_cells]

col_map2 = {name: idx+1 for idx, name in enumerate(headers2)}

rep_c = col_map2.get('대표자')
addr_c = col_map2.get('주소')
phone_c = col_map2.get('전화번호')
fax_c = col_map2.get('팩스번호')
hp_c = col_map2.get('홈페이지')
email_c = col_map2.get('이메일')
emp_c = col_map2.get('종업원수')
author_c = col_map2.get('작성자')
biz_c = col_map2.get('사업자번호')
comp_c = col_map2.get('회사명')

# 원본 key 매칭
company_idx1 = headers1.index('회사명') if '회사명' in headers1 else -1
biz_idx1 = headers1.index('사업자번호') if '사업자번호' in headers1 else -1

col_mapping = {}
for idx2, h2 in enumerate(headers2):
    if h2 in headers1:
        col_mapping[idx2 + 1] = headers1.index(h2)

f1_key_map = {}
for r_idx, r_val in enumerate(s1_rows[1:], start=2):
    biz = str(r_val[biz_idx1]).strip() if biz_idx1 != -1 and biz_idx1 < len(r_val) and r_val[biz_idx1] else ""
    comp = str(r_val[company_idx1]).strip() if company_idx1 != -1 and company_idx1 < len(r_val) and r_val[company_idx1] else ""
    clean_b = re.sub(r'[^0-9]', '', biz)
    key = (clean_b, comp)
    if key != ("", "") and key not in f1_key_map:
        f1_key_map[key] = r_val

# 새로운 출처 컬럼 7개 추가 (열 58 ~ 64)
src_headers = [
    '대표자_출처',
    '주소_출처',
    '전화번호_출처',
    '팩스번호_출처',
    '홈페이지_출처',
    '이메일_출처',
    '종업원수_출처'
]

start_src_col = 58
header_font = Font(bold=True)

for i, h_title in enumerate(src_headers):
    c_idx = start_src_col + i
    cell = s2.cell(row=1, column=c_idx)
    cell.value = h_title
    cell.font = header_font

col_src_map = {
    '대표자': start_src_col + 0,
    '주소': start_src_col + 1,
    '전화번호': start_src_col + 2,
    '팩스번호': start_src_col + 3,
    '홈페이지': start_src_col + 4,
    '이메일': start_src_col + 5,
    '종업원수': start_src_col + 6,
}

print("2. 데이터 출처(Source) 추적 및 열 채우기 시작...")

processed_rows = 0

for r_idx2, row_cells in enumerate(s2.iter_rows(min_row=2, max_col=max_c), start=2):
    val_author = str(row_cells[author_c-1].value).strip() if author_c and row_cells[author_c-1].value is not None else ""
    
    biz2 = normalize_val(row_cells[biz_c-1].value, '사업자번호') if biz_c else ""
    comp2 = normalize_val(row_cells[comp_c-1].value, '회사명') if comp_c else ""
    key2 = (biz2, comp2)
    
    target_r1_val = None
    if key2 != ("", "") and key2 in f1_key_map:
        target_r1_val = f1_key_map[key2]
    elif r_idx2 - 1 < len(s1_rows):
        target_r1_val = s1_rows[r_idx2 - 1]

    # 각 항목별 출처 판단
    target_cols = [
        ('대표자', rep_c, '비즈노(BizNo) / 국세청'),
        ('주소', addr_c, '비즈노(BizNo) / 도로명주소'),
        ('전화번호', phone_c, '네이버지도 / 비즈노 / 114'),
        ('팩스번호', fax_c, '비즈노(BizNo) / 포털검색'),
        ('홈페이지', hp_c, '웹 접속 검증(HTTP 200 OK)'),
        ('이메일', email_c, '이메일 도메인 검증(MX/DNS)'),
        ('종업원수', emp_c, '국민연금 / 국세청 고용DB')
    ]

    for col_name, c_idx2, new_source_name in target_cols:
        if not c_idx2:
            continue
        dest_src_col = col_src_map[col_name]
        dest_cell = s2.cell(row=r_idx2, column=dest_src_col)
        
        curr_val = row_cells[c_idx2-1].value
        n_curr = normalize_val(curr_val, col_name)
        
        if n_curr == "":
            dest_cell.value = "-"
            continue
            
        c_idx1 = col_mapping.get(c_idx2)
        orig_raw_val = target_r1_val[c_idx1] if target_r1_val and c_idx1 is not None and c_idx1 < len(target_r1_val) else None
        n_orig = normalize_val(orig_raw_val, col_name)
        
        # 신규로 입력/수정되었거나 새로 수집된 경우
        if n_orig == "":
            dest_cell.value = new_source_name
            if '배현명(7.20~)' in val_author:
                dest_cell.fill = yellow_fill
        else:
            # 원본부터 이미 값이 있던 경우
            dest_cell.value = "실사 DB 원본"
            
    processed_rows += 1

print(f"\n==========================================")
print(f"📊 출처(Source) 열 생성 및 작성 완료")
print(f"==========================================")
print(f" - 전체 대상 행: {processed_rows}개 행")
print(f" - 생성된 출처 컬럼: 대표자_출처, 주소_출처, 전화번호_출처, 팩스번호_출처, 홈페이지_출처, 이메일_출처, 종업원수_출처")
print(f"==========================================")

print("3. 결과 파일 저장 중...")
wb2.save(f2)
wb2.save(f2_alt)
print(f"✅ 저장 완료:\n 1. {f2}\n 2. {f2_alt}")
