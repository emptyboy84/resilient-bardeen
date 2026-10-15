import json
import re

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\user_uploaded_raw.tsv', 'r', encoding='utf-8') as f:
    text = f.read()

lines = [l for l in text.split('\n') if l.strip() and not l.startswith('<') and not l.startswith('NOTE:')]

raw_entries = []
for l in lines:
    parts = l.split('\t')
    # handle cases where parts has author or not
    # format is: [작성자, 비고, 회사명, 사업자번호, 대표자, 우편번호, 주소, 전화번호, 팩스번호, 홈페이지, 이메일, 종업원수, 업종(NICE), 법인번호, 결산월, 업종_대, 업종_중, 업종_소...]
    # If author is omitted, parts[0] might be empty or parts[0] is company name
    while len(parts) < 18:
        parts.append('')
        
    cname = parts[2].strip() if parts[2].strip() else parts[1].strip()
    bno = re.sub(r'[^0-9]', '', parts[3].strip() if parts[3].strip() else parts[2].strip())
    
    # If parts[2] looks like bno and parts[1] is cname
    if re.match(r'^\d{10}$', parts[2].strip()):
        bno = parts[2].strip()
        cname = parts[1].strip()
    elif re.match(r'^\d{10}$', parts[3].strip()):
        bno = parts[3].strip()
        cname = parts[2].strip()
        
    if cname or bno:
        raw_entries.append({
            'original_line': parts,
            'cname': cname,
            'bno': bno,
            'ceo': parts[4].strip(),
            'zip': parts[5].strip(),
            'addr': parts[6].strip(),
            'phone': parts[7].strip(),
            'fax': parts[8].strip(),
            'homepage': parts[9].strip(),
            'email': parts[10].strip(),
            'emp': parts[11].strip(),
            'ind_nice': parts[12].strip(),
            'corp_no': parts[13].strip(),
            'settle': parts[14].strip(),
            'ind_l': parts[15].strip(),
            'ind_m': parts[16].strip(),
            'ind_s': parts[17].strip()
        })

print(f"Total extracted raw entries: {len(raw_entries)}")
targets_500 = raw_entries[:500]
print(f"Top 500 count: {len(targets_500)}")
print("First 3 targets:", targets_500[:3])
print("Target 500th:", targets_500[499])

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\targets_500.json', 'w', encoding='utf-8') as f:
    json.dump(targets_500, f, ensure_ascii=False, indent=2)

print("Saved targets_500.json")
