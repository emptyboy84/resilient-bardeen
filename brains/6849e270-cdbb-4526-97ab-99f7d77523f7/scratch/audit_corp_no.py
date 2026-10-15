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

all_rows = []
for batch_idx in [0, 1]:
    for line_idx, l in enumerate(user_texts[batch_idx].splitlines()):
        l_str = l.strip('\r\n')
        if not l_str or l_str.startswith('<') or l_str.startswith('NOTE:') or l_str == '지금까지 한거다' or 'The user changed' in l_str or 'The current local time' in l_str or l_str.startswith('@[') or l_str.startswith('#') or l_str.startswith('작성자\t'):
            continue
        cols = l_str.split('\t')
        while len(cols) < 18:
            cols.append('')
        all_rows.append({
            'batch': batch_idx + 1,
            'orig_line': line_idx + 1,
            'cols': cols,
            'raw': l_str
        })

print(f"Total rows to audit: {len(all_rows)}")

# Corporate Registration Number (법인등록번호) Checksum Algorithm:
# Length: 13 digits
# Weights: [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
# Sum = sum(digits[i] * weights[i] for i in range(12))
# Checksum = (10 - (Sum % 10)) % 10
# Compare Checksum with digits[12]

def validate_corp_registration_no(corp_no_str):
    if not corp_no_str:
        return True, "미기재", None, None
    
    clean = re.sub(r'[^0-9]', '', corp_no_str)
    
    if len(clean) != 13:
        return False, f"자릿수 오류 ({len(clean)}자리, 13자리 필요)", clean, None
    
    weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    digits = [int(c) for c in clean]
    
    s = sum(digits[i] * weights[i] for i in range(12))
    chk = (10 - (s % 10)) % 10
    
    if digits[12] == chk:
        return True, "유효", clean, chk
    else:
        return False, f"체크섬 불일치 (기대값: {chk}, 입력값: {digits[12]})", clean, chk

# Audit Categories:
# 1. 법인번호 형식/자릿수 오류
# 2. 법인번호 체크섬 오류
# 3. 법인번호 중복 (동일 법인번호가 여러 행에 존재)
# 4. 상호명에 '주식회사/(주)/법인/재단/사단/학교/협동조합' 등이 포함되어 법인으로 추정되나 법인번호가 누락(공란)된 경우
# 5. 개인사업자/비법인 추정 기업인데 법인번호가 기재된 경우
# 6. 컬럼 밀림으로 법인번호 컬럼에 엉뚱한 값이 들어간 경우

corp_no_counts = 0
format_errors = []
checksum_errors = []
corp_no_map = {}
missing_corp_for_corporations = []
non_corp_with_corp_no = []
column_shift_suspects = []

corp_keywords = ['주식회사', '(주)', '㈜', '사단법인', '재단법인', '의료법인', '학교법인', '사회복지법인', '협동조합', '(사)', '(재)', '(의)', '(학)', '(복)', '유한회사', '유한책임회사', '농업회사법인']

for idx, item in enumerate(all_rows, 1):
    cols = item['cols']
    name = cols[2].strip()
    biz_no = cols[3].strip()
    corp_no = cols[13].strip()
    settle_month = cols[14].strip()
    note = cols[1].strip()
    
    is_corp_name = any(kw in name for kw in corp_keywords)
    
    # Check if corp_no is filled
    if corp_no:
        corp_no_counts += 1
        
        # Check column shift (if corp_no has text like '12월' or Korean words)
        if not re.search(r'\d', corp_no) or re.search(r'[가-힣]', corp_no):
            column_shift_suspects.append({
                'row': idx,
                'name': name,
                'corp_no': corp_no,
                'reason': f"숫자가 아닌 텍스트 입력됨: '{corp_no}'"
            })
            continue
            
        is_valid, reason, clean_num, expected_chk = validate_corp_registration_no(corp_no)
        
        if not is_valid:
            if "자릿수" in reason:
                format_errors.append({
                    'row': idx,
                    'batch': item['batch'],
                    'name': name,
                    'biz_no': biz_no,
                    'corp_no': corp_no,
                    'reason': reason
                })
            else:
                checksum_errors.append({
                    'row': idx,
                    'batch': item['batch'],
                    'name': name,
                    'biz_no': biz_no,
                    'corp_no': corp_no,
                    'reason': reason,
                    'expected': expected_chk,
                    'actual': int(clean_num[-1]) if clean_num else None
                })
        
        if clean_num:
            corp_no_map.setdefault(clean_num, []).append({
                'row': idx,
                'batch': item['batch'],
                'name': name,
                'biz_no': biz_no,
                'corp_no': corp_no
            })
            
        if not is_corp_name and '폐업' not in note:
            # Check if this company without corp keywords has corp_no
            non_corp_with_corp_no.append({
                'row': idx,
                'name': name,
                'biz_no': biz_no,
                'corp_no': corp_no
            })
    else:
        # Corp_no is empty
        if is_corp_name and '폐업' not in note and '휴업' not in note:
            missing_corp_for_corporations.append({
                'row': idx,
                'batch': item['batch'],
                'name': name,
                'biz_no': biz_no
            })

# Duplicate corp_no
duplicate_corp_nos = {}
for c_no, occurrences in corp_no_map.items():
    if len(occurrences) > 1:
        duplicate_corp_nos[c_no] = occurrences

audit_results = {
    'total_rows': len(all_rows),
    'corp_no_filled_count': corp_no_counts,
    'corp_no_empty_count': len(all_rows) - corp_no_counts,
    'format_errors': format_errors,
    'checksum_errors': checksum_errors,
    'duplicate_corp_nos': duplicate_corp_nos,
    'missing_corp_for_corporations': missing_corp_for_corporations,
    'non_corp_with_corp_no': non_corp_with_corp_no,
    'column_shift_suspects': column_shift_suspects
}

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\corp_no_audit.json', 'w', encoding='utf-8') as f:
    json.dump(audit_results, f, ensure_ascii=False, indent=2)

print("Corporate registration number audit completed.")
print(f"Total Rows: {len(all_rows)}")
print(f"Corp No Filled: {corp_no_counts} / Empty: {len(all_rows) - corp_no_counts}")
print(f"Format Errors: {len(format_errors)}")
print(f"Checksum Errors: {len(checksum_errors)}")
print(f"Duplicate Corp Nos: {len(duplicate_corp_nos)}")
print(f"Corporations Missing Corp No: {len(missing_corp_for_corporations)}")
print(f"Non-Corp Names with Corp No: {len(non_corp_with_corp_no)}")
print(f"Column Shift Suspects: {len(column_shift_suspects)}")
