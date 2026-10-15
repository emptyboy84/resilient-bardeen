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

companies = []
header = None

for batch_idx in [0, 1]:
    if batch_idx >= len(user_texts):
        continue
    lines = user_texts[batch_idx].splitlines()
    for line_idx, line in enumerate(lines):
        line_str = line.strip('\r\n')
        if not line_str:
            continue
        # Skip tags and non-data lines
        if line_str.startswith('<') or line_str.startswith('NOTE:') or line_str == '지금까지 한거다' or 'The user changed' in line_str or 'The current local time' in line_str or line_str.startswith('@[') or line_str.startswith('#'):
            continue
        if line_str.startswith('작성자\t'):
            if not header:
                header = line_str.split('\t')
            continue
        
        cols = line_str.split('\t')
        companies.append({
            'batch': batch_idx + 1,
            'source_line': line_idx + 1,
            'cols': cols,
            'raw': line_str
        })

print(f"Total pure corporate rows extracted: {len(companies)}")

# Check columns format
# Header columns (18):
# 0: 작성자, 1: 비고, 2: 회사명, 3: 사업자번호, 4: 대표자, 5: 우편번호, 6: 주소,
# 7: 전화번호, 8: 팩스번호, 9: 홈페이지, 10: 이메일, 11: 종업원수, 12: 업종(NICE),
# 13: 법인번호, 14: 결산월, 15: 업종_대, 16: 업종_중, 17: 업종_소

def validate_biz_no(biz_no_str):
    clean = re.sub(r'[^0-9]', '', biz_no_str)
    if not clean:
        return False, "미기재"
    if len(clean) != 10:
        return False, f"자릿수 오류 ({len(clean)}자리)"
    weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(8))
    s += (digits[8] * 5) // 10 + (digits[8] * 5) % 10
    chk = (10 - (s % 10)) % 10
    if digits[9] == chk:
        return True, "유효"
    else:
        return False, f"체크섬 불일치 (기대값:{chk}, 입력값:{digits[9]})"

def validate_corp_no(corp_no_str):
    clean = re.sub(r'[^0-9]', '', corp_no_str)
    if not clean:
        return True, "미기재"
    if len(clean) != 13:
        return False, f"자릿수 오류 ({len(clean)}자리)"
    return True, "유효"

def validate_email(email_str):
    if not email_str:
        return True, "미기재"
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if re.match(pattern, email_str.strip()):
        return True, "유효"
    return False, "형식 오류"

def validate_phone(phone_str):
    if not phone_str:
        return True, "미기재"
    clean = phone_str.strip().replace(' ', '').replace('"', '')
    pattern = r'^(0\d{1,2}|1\d{3}|050\d)-\d{3,4}-\d{4}$|^\d{4}-\d{4}$|^0\d{9,11}$'
    if re.match(pattern, clean):
        return True, "유효"
    return False, f"형식 오류 ({phone_str})"

def validate_zip(zip_str):
    if not zip_str:
        return True, "미기재"
    clean = zip_str.strip()
    if re.match(r'^\d{5}$', clean) or re.match(r'^\d{3}-\d{3}$', clean):
        return True, "유효"
    return False, f"형식 오류 ({zip_str})"

# Run checks
results = {
    'total_count': len(companies),
    'batch1_count': sum(1 for c in companies if c['batch'] == 1),
    'batch2_count': sum(1 for c in companies if c['batch'] == 2),
    'status_stats': {'정상': 0, '폐업': 0, '휴업': 0, '기타': 0},
    'column_mismatches': [],
    'biz_no_errors': [],
    'biz_no_duplicates': {},
    'company_duplicates': {},
    'critical_missing': [],
    'email_errors': [],
    'phone_errors': [],
    'zip_errors': [],
    'corp_no_errors': [],
    'truncated_rows': []
}

biz_map = {}
name_map = {}

for idx, item in enumerate(companies, 1):
    cols = item['cols']
    
    # Check truncated line at the end
    if len(cols) < 10 and idx == len(companies):
        results['truncated_rows'].append({
            'row': idx,
            'name': cols[2] if len(cols) > 2 else '',
            'raw': item['raw']
        })
    
    # Check column count
    if len(cols) != 18:
        results['column_mismatches'].append({
            'row': idx,
            'batch': item['batch'],
            'cols_count': len(cols),
            'raw': item['raw']
        })
    
    # Pad to 18
    while len(cols) < 18:
        cols.append('')
        
    author, note, name, biz_no, ceo, zip_code, address, phone, fax, homepage, email, emp_count, nice_ind, corp_no, settle_month, ind_l, ind_m, ind_s = [c.strip() for c in cols[:18]]
    
    # Status
    if '폐업' in note:
        results['status_stats']['폐업'] += 1
    elif '휴업' in note:
        results['status_stats']['휴업'] += 1
    elif note == '':
        results['status_stats']['정상'] += 1
    else:
        results['status_stats']['기타'] += 1

    # Missing critical check (For active businesses)
    is_active = ('폐업' not in note and '휴업' not in note)
    missing = []
    if not name:
        missing.append("회사명 누락")
    if not biz_no:
        missing.append("사업자번호 누락")
    if is_active:
        if not ceo:
            missing.append("대표자 누락")
        if not address:
            missing.append("주소 누락")
        if not (ind_l or ind_m or ind_s or nice_ind):
            missing.append("업종분류 누락")
    
    if missing:
        results['critical_missing'].append({
            'row': idx,
            'batch': item['batch'],
            'name': name or '(공란)',
            'biz_no': biz_no or '(공란)',
            'note': note,
            'missing': missing
        })

    # Biz No validation
    if biz_no:
        is_valid, reason = validate_biz_no(biz_no)
        if not is_valid:
            results['biz_no_errors'].append({
                'row': idx,
                'batch': item['batch'],
                'name': name,
                'biz_no': biz_no,
                'reason': reason
            })
        clean_biz = re.sub(r'[^0-9]', '', biz_no)
        if clean_biz:
            biz_map.setdefault(clean_biz, []).append({'row': idx, 'name': name, 'batch': item['batch']})

    # Company name duplicate check
    if name:
        clean_n = re.sub(r'[\s\(\)주식회사]', '', name)
        if clean_n:
            name_map.setdefault(clean_n, []).append({'row': idx, 'name': name, 'biz_no': biz_no, 'batch': item['batch']})

    # Corp No
    if corp_no:
        is_valid, reason = validate_corp_no(corp_no)
        if not is_valid:
            results['corp_no_errors'].append({
                'row': idx,
                'name': name,
                'corp_no': corp_no,
                'reason': reason
            })

    # Email
    if email:
        is_valid, reason = validate_email(email)
        if not is_valid:
            results['email_errors'].append({
                'row': idx,
                'name': name,
                'email': email,
                'reason': reason
            })

    # Phone
    if phone:
        is_valid, reason = validate_phone(phone)
        if not is_valid:
            results['phone_errors'].append({
                'row': idx,
                'name': name,
                'phone': phone,
                'reason': reason
            })

    # Zip
    if zip_code:
        is_valid, reason = validate_zip(zip_code)
        if not is_valid:
            results['zip_errors'].append({
                'row': idx,
                'name': name,
                'zip': zip_code,
                'reason': reason
            })

# Duplicates
for b_no, occs in biz_map.items():
    if len(occs) > 1:
        results['biz_no_duplicates'][b_no] = occs

for c_name, occs in name_map.items():
    if len(occs) > 1:
        results['company_duplicates'][c_name] = occs

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\clean_validation_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved clean_validation_results.json successfully.")
