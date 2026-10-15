import json
import re
import os

transcript_path = r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\.system_generated\logs\transcript_full.jsonl'

user_texts = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            content = step.get('content', '')
            user_texts.append(content)

raw_data = []
header = None

for i in [0, 1]:  # The two data inputs
    if i < len(user_texts):
        for line in user_texts[i].splitlines():
            line = line.strip('\r\n')
            if not line:
                continue
            if line.startswith('작성자\t'):
                if not header:
                    header = line.split('\t')
                continue
            if line.strip() == '지금까지 한거다':
                continue
            cols = line.split('\t')
            raw_data.append((i+1, cols, line))

# Header columns:
# 0: 작성자
# 1: 비고
# 2: 회사명
# 3: 사업자번호
# 4: 대표자
# 5: 우편번호
# 6: 주소
# 7: 전화번호
# 8: 팩스번호
# 9: 홈페이지
# 10: 이메일
# 11: 종업원수
# 12: 업종(NICE BizINFO(업종)참고)
# 13: 법인번호
# 14: 결산월
# 15: 업종_대
# 16: 업종_중
# 17: 업종_소

def validate_biz_no(biz_no_str):
    clean = re.sub(r'[^0-9]', '', biz_no_str)
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
        return False, f"체크섬 불일치 (기대: {chk}, 실제: {digits[9]})"

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
    return False, "이메일 형식 오류"

def validate_phone(phone_str):
    if not phone_str:
        return True, "미기재"
    clean = phone_str.strip().replace(' ', '').replace('"', '')
    pattern = r'^(0\d{1,2}|1\d{3}|050\d)-\d{3,4}-\d{4}$|^\d{4}-\d{4}$|^0\d{9,11}$'
    if re.match(pattern, clean):
        return True, "유효"
    return False, f"전화번호 형식 확인 필요 ({phone_str})"

def validate_zip(zip_str):
    if not zip_str:
        return True, "미기재"
    clean = zip_str.strip()
    if re.match(r'^\d{5}$', clean) or re.match(r'^\d{3}-\d{3}$', clean):
        return True, "유효"
    return False, f"우편번호 형식 오류 ({zip_str})"

# Run analysis
total_rows = len(raw_data)
biz_no_map = {}
company_name_map = {}

column_count_mismatch = []
invalid_biz_no = []
duplicate_biz_no = []
duplicate_company = []
invalid_emails = []
invalid_phones = []
invalid_zips = []
invalid_corps = []
missing_critical = []
closed_companies = []
suspended_companies = []

for idx, (batch, cols, raw_line) in enumerate(raw_data, 1):
    # Check column count (standard is 18)
    if len(cols) != 18:
        column_count_mismatch.append({
            'row': idx,
            'batch': batch,
            'cols_count': len(cols),
            'raw': raw_line
        })
    
    # Pad cols if less than 18
    while len(cols) < 18:
        cols.append('')
    
    author = cols[0].strip()
    note = cols[1].strip()
    name = cols[2].strip()
    biz_no = cols[3].strip()
    ceo = cols[4].strip()
    zip_code = cols[5].strip()
    address = cols[6].strip()
    phone = cols[7].strip()
    fax = cols[8].strip()
    homepage = cols[9].strip()
    email = cols[10].strip()
    employees = cols[11].strip()
    nice_ind = cols[12].strip()
    corp_no = cols[13].strip()
    settle_month = cols[14].strip()
    ind_large = cols[15].strip()
    ind_mid = cols[16].strip()
    ind_small = cols[17].strip()

    # Status tracking
    if '폐업' in note:
        closed_companies.append((idx, name, biz_no))
    if '휴업' in note:
        suspended_companies.append((idx, name, biz_no))

    # Critical missing
    missing_fields = []
    if not name:
        missing_fields.append("회사명 누락")
    if not biz_no:
        missing_fields.append("사업자번호 누락")
    if not ceo and '폐업' not in note:
        missing_fields.append("대표자 누락")
    if not address and '폐업' not in note:
        missing_fields.append("주소 누락")
    if not ind_large and not ind_mid and not ind_small and not nice_ind and '폐업' not in note:
        missing_fields.append("업종분류 누락")
    
    if missing_fields:
        missing_critical.append({
            'row': idx,
            'batch': batch,
            'name': name or '(이름없음)',
            'biz_no': biz_no,
            'note': note,
            'missing': missing_fields
        })

    # Validate biz_no
    if biz_no:
        is_valid, reason = validate_biz_no(biz_no)
        if not is_valid:
            invalid_biz_no.append({
                'row': idx,
                'batch': batch,
                'name': name,
                'biz_no': biz_no,
                'reason': reason
            })
        clean_biz = re.sub(r'[^0-9]', '', biz_no)
        if clean_biz in biz_no_map:
            biz_no_map[clean_biz].append((idx, name, batch))
        else:
            biz_no_map[clean_biz] = [(idx, name, batch)]

    # Validate company name
    if name:
        clean_name = re.sub(r'[\s\(\)주식회사]', '', name)
        if clean_name in company_name_map:
            company_name_map[clean_name].append((idx, name, biz_no, batch))
        else:
            company_name_map[clean_name] = [(idx, name, biz_no, batch)]

    # Validate corp_no
    if corp_no:
        is_valid, reason = validate_corp_no(corp_no)
        if not is_valid:
            invalid_corps.append({
                'row': idx,
                'name': name,
                'corp_no': corp_no,
                'reason': reason
            })

    # Validate email
    if email:
        is_valid, reason = validate_email(email)
        if not is_valid:
            invalid_emails.append({
                'row': idx,
                'name': name,
                'email': email,
                'reason': reason
            })

    # Validate phone
    if phone:
        is_valid, reason = validate_phone(phone)
        if not is_valid:
            invalid_phones.append({
                'row': idx,
                'name': name,
                'phone': phone,
                'reason': reason
            })

    # Validate zip
    if zip_code:
        is_valid, reason = validate_zip(zip_code)
        if not is_valid:
            invalid_zips.append({
                'row': idx,
                'name': name,
                'zip': zip_code,
                'reason': reason
            })

# Find duplicates
for clean_biz, occurrences in biz_no_map.items():
    if len(occurrences) > 1:
        duplicate_biz_no.append({
            'biz_no': clean_biz,
            'occurrences': occurrences
        })

for clean_name, occurrences in company_name_map.items():
    if len(occurrences) > 1:
        duplicate_company.append({
            'clean_name': clean_name,
            'occurrences': occurrences
        })

result = {
    'total_rows': total_rows,
    'closed_count': len(closed_companies),
    'suspended_count': len(suspended_companies),
    'column_count_mismatch': column_count_mismatch,
    'invalid_biz_no': invalid_biz_no,
    'duplicate_biz_no': duplicate_biz_no,
    'duplicate_company': duplicate_company,
    'missing_critical': missing_critical,
    'invalid_corps': invalid_corps,
    'invalid_emails': invalid_emails,
    'invalid_phones': invalid_phones,
    'invalid_zips': invalid_zips
}

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\validation_result.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Validation completed.")
print(f"Total Rows: {total_rows}")
print(f"Column Mismatches: {len(column_count_mismatch)}")
print(f"Invalid Biz Nos: {len(invalid_biz_no)}")
print(f"Duplicate Biz Nos: {len(duplicate_biz_no)}")
print(f"Duplicate Companies: {len(duplicate_company)}")
print(f"Missing Critical: {len(missing_critical)}")
print(f"Invalid Emails: {len(invalid_emails)}")
print(f"Invalid Phones: {len(invalid_phones)}")
print(f"Invalid Zips: {len(invalid_zips)}")
print(f"Closed: {len(closed_companies)}, Suspended: {len(suspended_companies)}")
