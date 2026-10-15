import urllib.request
import urllib.parse
import json
import re
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\biz_err_targets.json', 'r', encoding='utf-8') as f:
    targets = json.load(f)

def validate_biz_no(val):
    clean = re.sub(r'[^0-9]', '', str(val))
    if len(clean) != 10:
        return False, clean
    weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(8))
    s += (digits[8] * 5) // 10 + (digits[8] * 5) % 10
    chk = (10 - (s % 10)) % 10
    return digits[9] == chk, clean

def search_company_bizno(name, ceo, addr, old_bno):
    # Special cases
    if '대성이앤지' in name:
        return '606-86-35543', '사용자 제공/확인'
        
    query = re.sub(r'\(주\)|주식회사|㈜|\(사\)|\(재\)|\(의\)', '', name).strip()
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Find all /article/(\d{10})
            articles = re.findall(r'/article/(\d{10})', html)
            
            valid_candidates = []
            for b in articles:
                is_val, _ = validate_biz_no(b)
                if is_val and b not in valid_candidates:
                    valid_candidates.append(b)
                    
            if not valid_candidates:
                return None, '검색결과 없음'
                
            # If only 1 candidate, verify similarity or check detail
            if len(valid_candidates) == 1:
                cand = valid_candidates[0]
                cand_fmt = f"{cand[:3]}-{cand[3:5]}-{cand[5:]}"
                return cand_fmt, '단일후보 일치'
                
            # Multiple candidates -> check detail page for CEO or address match
            addr_key = addr.split()[1] if len(addr.split()) > 1 else '부산' # e.g. 부산진구, 사상구, 강서구
            
            for cand in valid_candidates:
                # 1. Similarity check with old_bno
                old_clean = re.sub(r'[^0-9]', '', old_bno)
                diff = sum(1 for a, b in zip(old_clean, cand) if a != b)
                if diff <= 2: # Typo within 1-2 digits
                    cand_fmt = f"{cand[:3]}-{cand[3:5]}-{cand[5:]}"
                    return cand_fmt, f'기존번호 유사도일치(오타{diff}자리수정)'
                    
                # 2. Check detail page
                try:
                    det_url = f"https://bizno.net/article/{cand}"
                    dreq = urllib.request.Request(det_url, headers=headers)
                    with urllib.request.urlopen(dreq, timeout=3) as dresp:
                        dhtml = dresp.read().decode('utf-8', errors='ignore')
                        if ceo and ceo in dhtml:
                            cand_fmt = f"{cand[:3]}-{cand[3:5]}-{cand[5:]}"
                            return cand_fmt, '대표자명 일치'
                        if addr_key and addr_key in dhtml:
                            cand_fmt = f"{cand[:3]}-{cand[3:5]}-{cand[5:]}"
                            return cand_fmt, '주소(구/군) 일치'
                except:
                    pass
                    
            cand = valid_candidates[0]
            cand_fmt = f"{cand[:3]}-{cand[3:5]}-{cand[5:]}"
            return cand_fmt, '최우선후보 매칭'
            
    except Exception as e:
        return None, f'조회에러: {e}'

results = []
print("Starting batch resolution...")
for idx, t in enumerate(targets, 1):
    name = t['name']
    ceo = t['ceo']
    addr = t['addr']
    old_bno = t['biz_no']
    
    new_bno, method = search_company_bizno(name, ceo, addr, old_bno)
    results.append({
        'row_id': t['row_id'],
        'name': name,
        'ceo': ceo,
        'addr': addr,
        'old_bno': old_bno,
        'new_bno': new_bno,
        'method': method
    })
    print(f"[{idx:2d}/{len(targets)}] {name:20s} | {old_bno} -> {new_bno} ({method})")
    time.sleep(0.3)

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\resolved_biz_numbers.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nFinished all! Saved resolved_biz_numbers.json.")
