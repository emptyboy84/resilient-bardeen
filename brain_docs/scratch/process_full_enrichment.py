import sys
import re
import urllib.request
import urllib.parse
import json
import socket
import concurrent.futures
import openpyxl
from openpyxl.styles import PatternFill

sys.stdout.reconfigure(encoding='utf-8')

f1 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720.xlsx'
f2 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
out_path = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_검증완료.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid") # 신규 입력 (노란색)
orange_fill = PatternFill(start_color="FFA500", end_color="FFA500", fill_type="solid") # 수정/삭제 (주황색)

def check_url(url):
    if not url or str(url).strip() in ['-', '', 'None']:
        return None, False
    url_str = str(url).strip()
    target_url = url_str if url_str.startswith('http://') or url_str.startswith('https://') else 'http://' + url_str
    
    try:
        req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status in [200, 301, 302]:
                return target_url, True
    except Exception:
        pass
    return url_str, False

def check_email(email):
    if not email or str(email).strip() in ['-', '', 'None']:
        return None, False
    email_str = str(email).strip()
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email_str):
        return email_str, False
    domain = email_str.split('@')[-1]
    try:
        socket.gethostbyname(domain)
        return email_str, True
    except Exception:
        return email_str, False

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

print("1. 엑셀 파일 로딩 중...")
wb1 = openpyxl.load_workbook(f1, data_only=True, read_only=True)
wb2 = openpyxl.load_workbook(f2)

s1 = wb1['기업 정보']
s2 = wb2['기업 정보']

max_c = 60
s1_rows = list(s1.iter_rows(max_col=max_c, values_only=True))
headers1 = [str(h).strip() if h is not None else "" for h in s1_rows[0]]

headers2 = []
for cell in list(s2.iter_rows(min_row=1, max_row=1, max_col=max_c))[0]:
    headers2.append(str(cell.value).strip() if cell.value is not None else "")
    
col_map2 = {name: idx+1 for idx, name in enumerate(headers2)}

author_c = col_map2.get('작성자')
hp_c = col_map2.get('홈페이지')
email_c = col_map2.get('이메일')

company_idx1 = headers1.index('회사명') if '회사명' in headers1 else -1
biz_idx1 = headers1.index('사업자번호') if '사업자번호' in headers1 else -1

col_mapping = {}
for idx2, h2 in enumerate(headers2):
    if h2 in headers1:
        col_mapping[idx2 + 1] = headers1.index(h2)

f1_key_map = {}
for r_idx, r_val in enumerate(s1_rows[1:], start=2):
    biz = normalize_val(r_val[biz_idx1], '사업자번호') if biz_idx1 != -1 and biz_idx1 < len(r_val) else ""
    comp = normalize_val(r_val[company_idx1], '회사명') if company_idx1 != -1 and company_idx1 < len(r_val) else ""
    key = (biz, comp)
    if key != ("", "") and key not in f1_key_map:
        f1_key_map[key] = r_val

print("2. '배현명(7.20~)' 행 대상 전수 비교 및 유효성 검증 시작...")

target_rows = []
for r_idx2, row_cells in enumerate(s2.iter_rows(min_row=2, max_col=max_c), start=2):
    val_author = str(row_cells[author_c-1].value).strip() if author_c and row_cells[author_c-1].value is not None else ""
    if '배현명(7.20~)' in val_author:
        target_rows.append((r_idx2, row_cells))

print(f"대상 행: 총 {len(target_rows)}개 행")

cleared_hp_count = 0
cleared_email_count = 0
yellow_count = 0
orange_count = 0
unchanged_count = 0

# 병렬 유효성 검사 준비
def process_row_validation(row_tuple):
    r_idx2, row_cells = row_tuple
    hp_val = row_cells[hp_c-1].value if hp_c else None
    email_val = row_cells[email_c-1].value if email_c else None
    
    hp_valid = True
    email_valid = True
    
    if hp_val and str(hp_val).strip() not in ['-', '']:
        _, hp_valid = check_url(hp_val)
        
    if email_val and str(email_val).strip() not in ['-', '']:
        _, email_valid = check_email(email_val)
        
    return r_idx2, hp_valid, email_valid

print("3. 홈페이지 및 이메일 접속/유효성 네트워크 검증 중...")
val_results = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(process_row_validation, tr) for tr in target_rows]
    for future in concurrent.futures.as_completed(futures):
        r_idx2, hp_v, em_v = future.result()
        val_results[r_idx2] = (hp_v, em_v)

print("4. 셀 비교 및 결과 반영 중...")

for r_idx2, row_cells in target_rows:
    hp_valid, email_valid = val_results.get(r_idx2, (True, True))
    
    # 홈페이지 불량 처리
    if hp_c and not hp_valid:
        cell_hp = row_cells[hp_c-1]
        if cell_hp.value and str(cell_hp.value).strip() not in ['-', '']:
            cell_hp.value = ""
            cell_hp.fill = orange_fill
            cleared_hp_count += 1
            
    # 이메일 불량 처리
    if email_c and not email_valid:
        cell_email = row_cells[email_c-1]
        if cell_email.value and str(cell_email.value).strip() not in ['-', '']:
            cell_email.value = ""
            cell_email.fill = orange_fill
            cleared_email_count += 1
            
    # 원본 파일 대비 비교 및 신규/수정 셀 색상 적용
    biz2 = ""
    comp2 = ""
    for c_idx2, cell2 in enumerate(row_cells, start=1):
        h2_name = headers2[c_idx2 - 1] if c_idx2 - 1 < len(headers2) else ""
        if h2_name == '사업자번호':
            biz2 = normalize_val(cell2.value, '사업자번호')
        elif h2_name == '회사명':
            comp2 = normalize_val(cell2.value, '회사명')
            
    key2 = (biz2, comp2)
    
    target_r1_val = None
    if key2 != ("", "") and key2 in f1_key_map:
        target_r1_val = f1_key_map[key2]
    elif r_idx2 - 1 < len(s1_rows):
        target_r1_val = s1_rows[r_idx2 - 1]
        
    if target_r1_val is None:
        for c_idx2, cell2 in enumerate(row_cells, start=1):
            col_name = headers2[c_idx2 - 1] if c_idx2 - 1 < len(headers2) else ""
            n_val2 = normalize_val(cell2.value, col_name)
            if n_val2 != "" and cell2.fill != orange_fill:
                cell2.fill = yellow_fill
                yellow_count += 1
        continue
        
    for c_idx2, cell2 in enumerate(row_cells, start=1):
        if c_idx2 not in col_mapping:
            continue
        c_idx1 = col_mapping[c_idx2]
        col_name = headers2[c_idx2 - 1] if c_idx2 - 1 < len(headers2) else ""
        
        orig_raw_val = target_r1_val[c_idx1] if c_idx1 < len(target_r1_val) else None
        new_raw_val = cell2.value
        
        norm_orig = normalize_val(orig_raw_val, col_name)
        norm_new = normalize_val(new_raw_val, col_name)
        
        # 주황색으로 지워진 셀 제외
        if cell2.fill == orange_fill:
            orange_count += 1
            continue
            
        if norm_orig == "" and norm_new != "":
            cell2.fill = yellow_fill
            yellow_count += 1
        elif norm_orig != "" and norm_new != "":
            if norm_orig != norm_new:
                cell2.fill = orange_fill
                orange_count += 1
            else:
                unchanged_count += 1

print(f"검증 통계:")
print(f" - 대상 행: {len(target_rows)}개")
print(f" - 접속 불가 홈페이지 삭제: {cleared_hp_count}개")
print(f" - 유효하지 않은 이메일 삭제: {cleared_email_count}개")
print(f" - 신규 입력 (노란색 셀): {yellow_count}개")
print(f" - 수정/삭제 입력 (주황색 셀): {orange_count}개")
print(f" - 의미상 동일/미변경: {unchanged_count}개")

print("5. 결과 저장 중...")
wb2.save(out_path)
print(f"✅ 결과 엑셀 저장 완료: {out_path}")
