import json
import re

transcript_path = r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\.system_generated\logs\transcript_full.jsonl'

user_texts = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            content = step.get('content', '')
            user_texts.append(content)

raw_rows = []
for batch_idx in [0, 1]:
    lines = user_texts[batch_idx].splitlines()
    for line_idx, line in enumerate(lines):
        line_str = line.strip('\r\n')
        if not line_str or line_str.startswith('<') or line_str.startswith('NOTE:') or line_str == '지금까지 한거다' or 'The user changed' in line_str or 'The current local time' in line_str or line_str.startswith('@[') or line_str.startswith('#') or line_str.startswith('작성자\t'):
            continue
        cols = line_str.split('\t')
        raw_rows.append({
            'row_id': len(raw_rows) + 1,
            'batch': batch_idx + 1,
            'source_line': line_idx + 1,
            'cols': cols,
            'raw': line_str
        })

print(f"Total raw rows loaded: {len(raw_rows)}")

# Update 주식회사에스피디 if in batch 2
for r in raw_rows:
    if len(r['cols']) > 2 and '에스피디' in r['cols'][2]:
        if len(r['cols']) < 18:
            while len(r['cols']) < 18:
                r['cols'].append('')
        r['cols'][13] = '180111-0650556'
        r['cols'][14] = '12월'

# Fix 삼에스개발(주) tab shift if present
for r in raw_rows:
    if len(r['cols']) > 2 and '삼에스개발' in r['cols'][2]:
        # raw cols check
        pass

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

def validate_url_str(val):
    if not val:
        return True, "미기재"
    clean = val.strip()
    if clean.startswith('http://') or clean.startswith('https://') or re.match(r'^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', clean):
        return True, "유효"
    return False, f"URL 형식 오류 ({val})"

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

# Audit Execution
report = {
    'total_count': len(raw_rows),
    'batch_breakdown': {'1차': sum(1 for r in raw_rows if r['batch'] == 1), '2차': sum(1 for r in raw_rows if r['batch'] == 2)},
    'status_breakdown': {'정상': 0, '폐업': 0, '휴업': 0, '기타': 0},
    'column_count_errors': [],
    'biz_no_errors': [],
    'biz_no_duplicates': {},
    'corp_no_errors': [],
    'corp_no_duplicates': {},
    'corp_no_missing_for_corps': [],
    'company_name_duplicates': {},
    'critical_missing': [],
    'phone_errors': [],
    'fax_errors': [],
    'email_errors': [],
    'url_errors': [],
    'zip_errors': [],
    'emp_errors': [],
    'industry_missing': [],
    'truncated_rows': []
}

biz_map = {}
corp_map = {}
name_map = {}

corp_keywords = ['주식회사', '(주)', '㈜', '사단법인', '재단법인', '의료법인', '학교법인', '사회복지법인', '협동조합', '(사)', '(재)', '(의)', '(학)', '(복)', '유한회사', '유한책임회사', '농업회사법인']

for r in raw_rows:
    idx = r['row_id']
    cols = r['cols']
    
    # Check truncated line
    if len(cols) < 10 and idx == len(raw_rows):
        report['truncated_rows'].append({
            'row': idx,
            'name': cols[2] if len(cols) > 2 else '',
            'raw': r['raw']
        })
    
    # Check col count
    if len(cols) != 18:
        report['column_count_errors'].append({
            'row': idx,
            'batch': r['batch'],
            'count': len(cols),
            'raw': r['raw']
        })
    
    # Pad to 18
    while len(cols) < 18:
        cols.append('')
        
    author, note, name, biz_no, ceo, zip_code, address, phone, fax, homepage, email, employees, nice_ind, corp_no, settle_month, ind_l, ind_m, ind_s = [c.strip() for c in cols[:18]]
    
    # Status
    if '폐업' in note:
        report['status_breakdown']['폐업'] += 1
    elif '휴업' in note:
        report['status_breakdown']['휴업'] += 1
    elif note == '':
        report['status_breakdown']['정상'] += 1
    else:
        report['status_breakdown']['기타'] += 1
        
    is_active = ('폐업' not in note and '휴업' not in note)
    is_corp_name = any(kw in name for kw in corp_keywords)

    # 1. Company Name
    if not name:
        report['critical_missing'].append({'row': idx, 'field': '회사명 누락', 'raw': r['raw']})
    else:
        clean_n = re.sub(r'[\s\(\)주식회사]', '', name)
        if clean_n:
            name_map.setdefault(clean_n, []).append({'row': idx, 'name': name, 'biz_no': biz_no, 'batch': r['batch']})

    # 2. Biz No
    if not biz_no:
        report['critical_missing'].append({'row': idx, 'name': name, 'field': '사업자번호 누락'})
    else:
        is_val, reason, clean_biz = validate_biz_no(biz_no)
        if not is_val:
            report['biz_no_errors'].append({'row': idx, 'batch': r['batch'], 'name': name, 'biz_no': biz_no, 'reason': reason})
        if clean_biz:
            biz_map.setdefault(clean_biz, []).append({'row': idx, 'name': name, 'batch': r['batch']})

    # 3. CEO & Address (Active)
    if is_active:
        if not ceo:
            report['critical_missing'].append({'row': idx, 'batch': r['batch'], 'name': name, 'field': '대표자 누락'})
        if not address:
            report['critical_missing'].append({'row': idx, 'batch': r['batch'], 'name': name, 'field': '주소 누락'})

    # 4. Corp No
    if corp_no:
        is_val, reason, clean_corp = validate_corp_no(corp_no)
        if not is_val:
            report['corp_no_errors'].append({'row': idx, 'batch': r['batch'], 'name': name, 'corp_no': corp_no, 'reason': reason})
        if clean_corp:
            corp_map.setdefault(clean_corp, []).append({'row': idx, 'name': name, 'biz_no': biz_no, 'batch': r['batch']})
    else:
        if is_corp_name and is_active:
            report['corp_no_missing_for_corps'].append({'row': idx, 'batch': r['batch'], 'name': name, 'biz_no': biz_no})

    # 5. Zip Code
    if zip_code:
        is_val, reason = validate_zip_str(zip_code)
        if not is_val:
            report['zip_errors'].append({'row': idx, 'name': name, 'zip': zip_code, 'reason': reason})

    # 6. Phone & Fax
    if phone:
        is_val, reason = validate_phone_str(phone)
        if not is_val:
            report['phone_errors'].append({'row': idx, 'name': name, 'phone': phone, 'reason': reason})
    if fax:
        is_val, reason = validate_phone_str(fax)
        if not is_val:
            report['fax_errors'].append({'row': idx, 'name': name, 'fax': fax, 'reason': reason})

    # 7. Email
    if email:
        is_val, reason = validate_email_str(email)
        if not is_val:
            report['email_errors'].append({'row': idx, 'name': name, 'email': email, 'reason': reason})

    # 8. Homepage URL
    if homepage:
        is_val, reason = validate_url_str(homepage)
        if not is_val:
            report['url_errors'].append({'row': idx, 'name': name, 'url': homepage, 'reason': reason})

    # 9. Employees Count
    if employees:
        is_val, reason = validate_emp_str(employees)
        if not is_val:
            report['emp_errors'].append({'row': idx, 'name': name, 'emp': employees, 'reason': reason})

    # 10. Industry Missing (Active)
    if is_active:
        if not (nice_ind or ind_l or ind_m or ind_s):
            report['industry_missing'].append({'row': idx, 'batch': r['batch'], 'name': name})

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

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\full_1000_audit.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("Full audit completed successfully.")
