import openpyxl
import json
import re

excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"

print("Loading workbook in read_only mode...")
wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)

sheet = wb.worksheets[0]
print(f"Auditing Sheet: {sheet.title}")

header = None
rows_data = []

row_idx = 0
for row in sheet.iter_rows(values_only=True):
    if not any(row):
        continue
    row_idx += 1
    if row_idx == 1:
        header = [str(c).strip() if c is not None else '' for c in row]
        print(f"Header: {header}")
        continue
    
    # Check author or include all non-empty rows
    # Convert all cells to strings
    cols = [str(c).strip() if c is not None else '' for c in row]
    
    # Filter rows that have at least company name or author
    author = cols[0] if len(cols) > 0 else ''
    name = cols[2] if len(cols) > 2 else ''
    biz_no = cols[3] if len(cols) > 3 else ''
    
    if not name and not biz_no:
        continue
        
    rows_data.append({
        'excel_row': row_idx,
        'cols': cols
    })

print(f"Total valid data rows extracted: {len(rows_data)}")

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

def validate_phone_str(val):
    if not val:
        return True, "미기재"
    clean = val.strip().replace(' ', '').replace('"', '')
    pattern = r'^(0\d{1,2}|1\d{3}|050\d)-\d{3,4}-\d{4}$|^\d{4}-\d{4}$|^0\d{9,11}$'
    if re.match(pattern, clean):
        return True, "유효"
    return False, f"형식 오류 ({val})"

def validate_email_str(val):
    if not val:
        return True, "미기재"
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if re.match(pattern, val.strip()):
        return True, "유효"
    return False, f"형식 오류 ({val})"

def validate_zip_str(val):
    if not val:
        return True, "미기재"
    clean = val.strip()
    if re.match(r'^\d{5}$', clean) or re.match(r'^\d{3}-\d{3}$', clean):
        return True, "유효"
    return False, f"우편번호 형식 오류 ({val})"

def validate_emp_str(val):
    if not val:
        return True, "미기재"
    clean = val.strip().replace(',', '')
    if clean.isdigit():
        return True, "유효"
    return False, f"숫자 아님 ({val})"

corp_keywords = ['주식회사', '(주)', '㈜', '사단법인', '재단법인', '의료법인', '학교법인', '사회복지법인', '협동조합', '(사)', '(재)', '(의)', '(학)', '(복)', '유한회사', '유한책임회사', '농업회사법인']

report = {
    'total_count': len(rows_data),
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
    'fax_errors': [],
    'zip_errors': [],
    'emp_errors': [],
    'industry_missing': []
}

biz_map = {}
corp_map = {}
name_map = {}

for r in rows_data:
    row_num = r['excel_row']
    cols = r['cols']
    while len(cols) < 18:
        cols.append('')
        
    author, note, name, biz_no, ceo, zip_code, address, phone, fax, homepage, email, employees, nice_ind, corp_no, settle_month, ind_l, ind_m, ind_s = [c.strip() for c in cols[:18]]
    
    # Status
    if '폐업' in note:
        report['status_stats']['폐업'] += 1
    elif '휴업' in note:
        report['status_stats']['휴업'] += 1
    elif note == '':
        report['status_stats']['정상'] += 1
    else:
        report['status_stats']['기타'] += 1
        
    is_active = ('폐업' not in note and '휴업' not in note)
    is_corp = any(kw in name for kw in corp_keywords)
    
    # 1. Company name
    if not name:
        report['critical_missing'].append({'excel_row': row_num, 'field': '회사명 누락', 'name': ''})
    else:
        clean_n = re.sub(r'[\s\(\)주식회사]', '', name)
        if clean_n:
            name_map.setdefault(clean_n, []).append({'excel_row': row_num, 'name': name, 'biz_no': biz_no})
            
    # 2. Biz No
    if not biz_no:
        report['critical_missing'].append({'excel_row': row_num, 'name': name, 'field': '사업자번호 누락'})
    else:
        is_val, reason, clean_biz = validate_biz_no(biz_no)
        if not is_val:
            report['biz_no_errors'].append({'excel_row': row_num, 'name': name, 'biz_no': biz_no, 'reason': reason})
        if clean_biz:
            biz_map.setdefault(clean_biz, []).append({'excel_row': row_num, 'name': name})
            
    # 3. Active critical missing
    if is_active:
        if not ceo:
            report['critical_missing'].append({'excel_row': row_num, 'name': name, 'field': '대표자 누락'})
        if not address:
            report['critical_missing'].append({'excel_row': row_num, 'name': name, 'field': '주소 누락'})
        if not (nice_ind or ind_l or ind_m or ind_s):
            report['industry_missing'].append({'excel_row': row_num, 'name': name})
            
    # 4. Corp No
    if corp_no:
        is_val, reason, clean_corp = validate_corp_no(corp_no)
        if not is_val:
            report['corp_no_errors'].append({'excel_row': row_num, 'name': name, 'corp_no': corp_no, 'reason': reason})
        if clean_corp:
            corp_map.setdefault(clean_corp, []).append({'excel_row': row_num, 'name': name, 'biz_no': biz_no})
    else:
        if is_corp and is_active:
            report['corp_no_missing_for_corps'].append({'excel_row': row_num, 'name': name, 'biz_no': biz_no})
            
    # 5. Formats
    if zip_code:
        is_val, reason = validate_zip_str(zip_code)
        if not is_val:
            report['zip_errors'].append({'excel_row': row_num, 'name': name, 'zip': zip_code, 'reason': reason})
    if phone:
        is_val, reason = validate_phone_str(phone)
        if not is_val:
            report['phone_errors'].append({'excel_row': row_num, 'name': name, 'phone': phone, 'reason': reason})
    if fax:
        is_val, reason = validate_phone_str(fax)
        if not is_val:
            report['fax_errors'].append({'excel_row': row_num, 'name': name, 'fax': fax, 'reason': reason})
    if email:
        is_val, reason = validate_email_str(email)
        if not is_val:
            report['email_errors'].append({'excel_row': row_num, 'name': name, 'email': email, 'reason': reason})
    if employees:
        is_val, reason = validate_emp_str(employees)
        if not is_val:
            report['emp_errors'].append({'excel_row': row_num, 'name': name, 'emp': employees, 'reason': reason})

# Duplicates
for b_no, occs in biz_map.items():
    if len(occs) > 1:
        report['biz_no_duplicates'][b_no] = occs

for c_no, occs in corp_map.items():
    if len(occs) > 1:
        report['corp_no_duplicates'][c_no] = occs

for c_name, occs in name_map.items():
    if len(occs) > 1:
        report['company_name_duplicates'][c_name] = occs

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\excel_file_audit_results.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("Excel File Audit Complete!")
print(f"Total Rows: {report['total_count']}")
print(f"Status: {report['status_stats']}")
print(f"Biz No Errors: {len(report['biz_no_errors'])}")
print(f"Duplicate Biz Nos: {len(report['biz_no_duplicates'])}")
print(f"Corp No Errors: {len(report['corp_no_errors'])}")
print(f"Duplicate Corp Nos: {len(report['corp_no_duplicates'])}")
print(f"Corporations Missing Corp No: {len(report['corp_no_missing_for_corps'])}")
print(f"Critical Missing: {len(report['critical_missing'])}")
print(f"Email Errors: {len(report['email_errors'])}")
