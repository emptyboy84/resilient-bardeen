import openpyxl
import json
import re

excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"

print("Loading workbook in read_only mode...")
wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
sheet = wb.worksheets[0]

header = None
bhm_rows = []
all_authors = {}

row_idx = 0
for row in sheet.iter_rows(values_only=True):
    if not any(row):
        continue
    row_idx += 1
    cols = [str(c).strip() if c is not None else '' for c in row]
    if row_idx == 1:
        header = cols
        continue
    
    author = cols[0] if len(cols) > 0 else ''
    all_authors[author] = all_authors.get(author, 0) + 1
    
    # Check if author contains 배현명 or if author is 배현명
    if '배현명' in author:
        bhm_rows.append({
            'excel_row': row_idx,
            'cols': cols
        })

print(f"Authors summary in Excel: {all_authors}")
print(f"Total rows for '배현명': {len(bhm_rows)}")

# Check header mapping
# Let's find the exact column indices for standard fields in header
col_map = {}
for i, h in enumerate(header):
    if '작성자' in h: col_map['author'] = i
    elif '비고' in h: col_map['note'] = i
    elif '회사명' in h: col_map['name'] = i
    elif '사업자' in h and '번호' in h: col_map.setdefault('biz_no', i)
    elif '대표자' in h: col_map['ceo'] = i
    elif '우편번호' in h: col_map['zip'] = i
    elif '주소' in h and '상세' not in h: col_map.setdefault('address', i)
    elif '전화번호' in h: col_map['phone'] = i
    elif '팩스번호' in h: col_map['fax'] = i
    elif '홈페이지' in h: col_map['homepage'] = i
    elif '이메일' in h: col_map.setdefault('email', i)
    elif '종업원' in h: col_map['emp'] = i
    elif 'NICE' in h or '업종' in h and '대' not in h and '중' not in h and '소' not in h: col_map.setdefault('nice_ind', i)
    elif '법인' in h and '번호' in h: col_map['corp_no'] = i
    elif '결산' in h: col_map['settle'] = i
    elif '업종_대' in h: col_map['ind_l'] = i
    elif '업종_중' in h: col_map['ind_m'] = i
    elif '업종_소' in h: col_map['ind_s'] = i

print(f"Header mapping: {col_map}")

# Now let's audit specifically 배현명's rows with precise column indexing
def validate_biz_no(val):
    clean = re.sub(r'[^0-9]', '', val)
    if not clean:
        return False, "미기재", clean
    if len(clean) != 10:
        return False, f"자릿수 오류 ({len(clean)}자리)", clean
    weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(8))
    s += (digits[8] * 5) // 10 + (digits[8] * 5) % 10
    chk = (10 - (s % 10)) % 10
    if digits[9] == chk:
        return True, "유효", clean
    else:
        return False, f"체크섬 불일치 (기대값:{chk}, 입력값:{digits[9]})", clean

def validate_corp_no(val):
    clean = re.sub(r'[^0-9]', '', val)
    if not clean:
        return True, "미기재", None
    if len(clean) != 13:
        return False, f"자릿수 오류 ({len(clean)}자리)", clean
    weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(12))
    chk = (10 - (s % 10)) % 10
    if digits[12] == chk:
        return True, "유효", clean
    else:
        return False, f"체크섬 불일치 (기대값:{chk}, 입력값:{digits[12]})", clean

corp_keywords = ['주식회사', '(주)', '㈜', '사단법인', '재단법인', '의료법인', '학교법인', '사회복지법인', '협동조합', '(사)', '(재)', '(의)', '(학)', '(복)', '유한회사', '유한책임회사', '농업회사법인']

report_bhm = {
    'total_bhm_rows': len(bhm_rows),
    'status_stats': {'정상': 0, '폐업': 0, '휴업': 0, '기타': 0},
    'biz_no_errors': [],
    'biz_no_duplicates': {},
    'corp_no_errors': [],
    'corp_no_duplicates': {},
    'corp_no_missing_for_corps': [],
    'company_name_duplicates': {},
    'critical_missing': [],
    'email_errors': [],
    'phone_errors': [],
    'zip_errors': [],
    'emp_errors': [],
    'industry_missing': []
}

biz_map = {}
corp_map = {}
name_map = {}

def get_col(cols, key):
    idx = col_map.get(key)
    if idx is not None and idx < len(cols):
        return cols[idx].strip()
    return ''

for r in bhm_rows:
    row_num = r['excel_row']
    cols = r['cols']
    
    author = get_col(cols, 'author')
    note = get_col(cols, 'note')
    name = get_col(cols, 'name')
    biz_no = get_col(cols, 'biz_no')
    ceo = get_col(cols, 'ceo')
    zip_code = get_col(cols, 'zip')
    address = get_col(cols, 'address')
    phone = get_col(cols, 'phone')
    fax = get_col(cols, 'fax')
    homepage = get_col(cols, 'homepage')
    email = get_col(cols, 'email')
    emp = get_col(cols, 'emp')
    nice_ind = get_col(cols, 'nice_ind')
    corp_no = get_col(cols, 'corp_no')
    settle = get_col(cols, 'settle')
    ind_l = get_col(cols, 'ind_l')
    ind_m = get_col(cols, 'ind_m')
    ind_s = get_col(cols, 'ind_s')
    
    # Status
    if '폐업' in note:
        report_bhm['status_stats']['폐업'] += 1
    elif '휴업' in note:
        report_bhm['status_stats']['휴업'] += 1
    elif note == '':
        report_bhm['status_stats']['정상'] += 1
    else:
        report_bhm['status_stats']['기타'] += 1
        
    is_active = ('폐업' not in note and '휴업' not in note)
    is_corp = any(kw in name for kw in corp_keywords)
    
    # 1. Company Name
    if not name:
        report_bhm['critical_missing'].append({'excel_row': row_num, 'name': '', 'field': '회사명 누락'})
    else:
        clean_n = re.sub(r'[\s\(\)주식회사]', '', name)
        if clean_n:
            name_map.setdefault(clean_n, []).append({'excel_row': row_num, 'name': name, 'biz_no': biz_no})
            
    # 2. Biz No
    if not biz_no:
        report_bhm['critical_missing'].append({'excel_row': row_num, 'name': name, 'field': '사업자번호 누락'})
    else:
        is_val, reason, clean_biz = validate_biz_no(biz_no)
        if not is_val:
            report_bhm['biz_no_errors'].append({'excel_row': row_num, 'name': name, 'biz_no': biz_no, 'reason': reason})
        if clean_biz:
            biz_map.setdefault(clean_biz, []).append({'excel_row': row_num, 'name': name})
            
    # 3. Active critical missing
    if is_active:
        if not ceo:
            report_bhm['critical_missing'].append({'excel_row': row_num, 'name': name, 'field': '대표자 누락'})
        if not address:
            report_bhm['critical_missing'].append({'excel_row': row_num, 'name': name, 'field': '주소 누락'})
        if not (nice_ind or ind_l or ind_m or ind_s):
            report_bhm['industry_missing'].append({'excel_row': row_num, 'name': name})
            
    # 4. Corp No
    if corp_no:
        is_val, reason, clean_corp = validate_corp_no(corp_no)
        if not is_val:
            report_bhm['corp_no_errors'].append({'excel_row': row_num, 'name': name, 'corp_no': corp_no, 'reason': reason})
        if clean_corp:
            corp_map.setdefault(clean_corp, []).append({'excel_row': row_num, 'name': name, 'biz_no': biz_no})
    else:
        if is_corp and is_active:
            report_bhm['corp_no_missing_for_corps'].append({'excel_row': row_num, 'name': name, 'biz_no': biz_no})

for b_no, occs in biz_map.items():
    if len(occs) > 1:
        report_bhm['biz_no_duplicates'][b_no] = occs

for c_no, occs in corp_map.items():
    if len(occs) > 1:
        report_bhm['corp_no_duplicates'][c_no] = occs

for c_name, occs in name_map.items():
    if len(occs) > 1:
        report_bhm['company_name_duplicates'][c_name] = occs

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_excel_audit.json', 'w', encoding='utf-8') as f:
    json.dump(report_bhm, f, ensure_ascii=False, indent=2)

print(f"BHM Excel Rows: {report_bhm['total_bhm_rows']}")
print(f"BHM Status Stats: {report_bhm['status_stats']}")
print(f"BHM Biz No Errors: {len(report_bhm['biz_no_errors'])}")
print(f"BHM Duplicate Biz Nos: {len(report_bhm['biz_no_duplicates'])}")
print(f"BHM Corp No Errors: {len(report_bhm['corp_no_errors'])}")
print(f"BHM Missing Corp for Corps: {len(report_bhm['corp_no_missing_for_corps'])}")
print(f"BHM Critical Missing: {len(report_bhm['critical_missing'])}")
