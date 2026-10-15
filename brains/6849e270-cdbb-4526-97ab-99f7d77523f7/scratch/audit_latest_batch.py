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

latest_input = user_texts[-1]
lines = latest_input.strip().splitlines()
print(f"Total lines in latest input: {len(lines)}")

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

audited_rows = []
for idx, line in enumerate(lines, 1):
    line_clean = line.strip()
    if not line_clean or line_clean.startswith('<') or line_clean.startswith('NOTE:'):
        continue
    cols = line_clean.split('\t')
    while len(cols) < 18:
        cols.append('')
        
    author, note, name, biz_no, ceo, zip_c, addr, phone, fax, homepage, email, emp, nice_ind, corp_no, settle, ind_l, ind_m, ind_s = [c.strip() for c in cols[:18]]
    
    row_errors = []
    is_active = ('폐업' not in note and '휴업' not in note)
    is_corp = any(kw in name for kw in corp_keywords)
    
    # 1. Biz No Check
    if not biz_no:
        row_errors.append("사업자번호 누락")
    else:
        is_val, reason, clean_b = validate_biz_no(biz_no)
        if not is_val:
            row_errors.append(f"사업자번호 {reason}")
            
    # 2. Corp No Check
    if corp_no:
        is_val, reason, clean_c = validate_corp_no(corp_no)
        if not is_val:
            row_errors.append(f"법인번호 {reason}")
        if not settle:
            row_errors.append("결산월 누락")
    else:
        if is_corp and is_active:
            row_errors.append("법인기업이나 법인번호 미기재")
            
    # 3. Critical Missing
    if is_active:
        if not name:
            row_errors.append("회사명 누락")
        if not ceo:
            row_errors.append("대표자 누락")
        if not addr:
            row_errors.append("주소 누락")
            
    # 4. Formats
    if phone and not re.match(r'^(0\d{1,2}|1\d{3}|050\d)-\d{3,4}-\d{4}$|^\d{4}-\d{4}$|^0\d{9,11}$', phone.replace(' ', '')):
        row_errors.append(f"전화번호 형식오류({phone})")
    if fax and not re.match(r'^(0\d{1,2}|1\d{3}|050\d)-\d{3,4}-\d{4}$|^\d{4}-\d{4}$|^0\d{9,11}$', fax.replace(' ', '')):
        row_errors.append(f"팩스번호 형식오류({fax})")
    if email and not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email.strip()):
        row_errors.append(f"이메일 형식오류({email})")
    if emp and not emp.replace(',', '').isdigit():
        row_errors.append(f"종업원수 형식오류({emp})")
        
    audited_rows.append({
        'row_id': idx,
        'author': author,
        'note': note,
        'name': name,
        'biz_no': biz_no,
        'ceo': ceo,
        'addr': addr,
        'corp_no': corp_no,
        'errors': row_errors,
        'status': '정상' if not row_errors else '오류/확인필요'
    })

print(f"Total pure valid rows: {len(audited_rows)}")
normal_count = sum(1 for r in audited_rows if r['status'] == '정상')
error_count = sum(1 for r in audited_rows if r['status'] != '정상')
print(f"Normal: {normal_count}, Needs Attention: {error_count}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\latest_batch_audit.json', 'w', encoding='utf-8') as f:
    json.dump(audited_rows, f, ensure_ascii=False, indent=2)

print("Saved latest_batch_audit.json successfully.")
