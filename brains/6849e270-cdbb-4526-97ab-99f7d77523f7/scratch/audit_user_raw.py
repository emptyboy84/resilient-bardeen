import json
import re

def validate_biz_no(bno):
    bno = re.sub(r'[^0-9]', '', str(bno))
    if len(bno) != 10:
        return False
    weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    s = sum(int(bno[i]) * weights[i] for i in range(9))
    s += (int(bno[8]) * 5) // 10
    chk = (10 - (s % 10)) % 10
    return chk == int(bno[9])

def validate_corp_no(cno):
    cno = re.sub(r'[^0-9]', '', str(cno))
    if len(cno) != 13:
        return False
    weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    s = sum(int(cno[i]) * weights[i] for i in range(12))
    chk = (10 - (s % 10)) % 10
    return chk == int(cno[12])

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\user_uploaded_raw.tsv', 'r', encoding='utf-8') as f:
    text = f.read()

# Filter out system tags
lines = [l for l in text.split('\n') if l.strip() and not l.startswith('<') and not l.startswith('NOTE:')]

rows = []
for idx, l in enumerate(lines, 1):
    parts = l.split('\t')
    rows.append((idx, parts))

print(f"Total parsed rows: {len(rows)}")

issues = []
for idx, parts in rows:
    # pad parts to at least 18
    while len(parts) < 18:
        parts.append('')
        
    author = parts[0].strip()
    remark = parts[1].strip()
    name = parts[2].strip()
    biz_no = parts[3].strip()
    ceo = parts[4].strip()
    zip_c = parts[5].strip()
    addr = parts[6].strip()
    phone = parts[7].strip()
    fax = parts[8].strip()
    homepage = parts[9].strip()
    email = parts[10].strip()
    emp = parts[11].strip()
    ind_nice = parts[12].strip()
    corp_no = parts[13].strip()
    settle = parts[14].strip()
    ind_l = parts[15].strip()
    ind_m = parts[16].strip()
    ind_s = parts[17].strip()
    
    # 1. Author missing
    if not author:
        issues.append({
            'row': idx, 'name': name, 'col': '작성자(A열)', 'issue': '작성자 누락', 'val': author, 'severity': '중간'
        })
    # 2. Biz number checksum
    if biz_no:
        clean_b = re.sub(r'[^0-9]', '', biz_no)
        if not validate_biz_no(clean_b):
            issues.append({
                'row': idx, 'name': name, 'col': '사업자번호(D열)', 'issue': '사업자번호 체크섬 오류', 'val': biz_no, 'severity': '높음'
            })
    else:
        issues.append({
            'row': idx, 'name': name, 'col': '사업자번호(D열)', 'issue': '사업자번호 누락', 'val': '', 'severity': '높음'
        })
        
    # 3. Corp number checksum
    if corp_no:
        clean_c = re.sub(r'[^0-9]', '', corp_no)
        if not validate_corp_no(clean_c):
            issues.append({
                'row': idx, 'name': name, 'col': '법인번호(N열/Y열)', 'issue': '법인번호 체크섬 오류', 'val': corp_no, 'severity': '중간'
            })
            
    # 4. Email in homepage
    if '@' in homepage:
        issues.append({
            'row': idx, 'name': name, 'col': '홈페이지(J열)', 'issue': '홈페이지에 이메일 기입', 'val': homepage, 'severity': '중간'
        })
        
    # 5. Full-width paren
    if '（' in name or '）' in name:
        issues.append({
            'row': idx, 'name': name, 'col': '회사명(C열)', 'issue': '전각 괄호 혼용', 'val': name, 'severity': '낮음'
        })
        
    # 6. Quotes / special characters
    if '"' in fax or '\t' in fax or '\n' in addr:
        issues.append({
            'row': idx, 'name': name, 'col': '서식오류', 'issue': '따옴표/줄바꿈 오염', 'val': fax or addr, 'severity': '낮음'
        })

print(f"Total issues found in uploaded text: {len(issues)}")
severity_counts = {}
for iss in issues:
    severity_counts[iss['severity']] = severity_counts.get(iss['severity'], 0) + 1
print("Severity counts:", severity_counts)

# Breakdown by issue type
type_counts = {}
for iss in issues:
    type_counts[iss['issue']] = type_counts.get(iss['issue'], 0) + 1
print("Type counts:", type_counts)

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\user_raw_audit_results.json', 'w', encoding='utf-8') as out_f:
    json.dump(issues, out_f, ensure_ascii=False, indent=2)
