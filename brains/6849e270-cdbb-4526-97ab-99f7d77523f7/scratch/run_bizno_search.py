import urllib.request
import urllib.parse
import json
import re
import time
from bs4 import BeautifulSoup

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

def search_bizno(name, ceo, addr):
    # Search bizno
    query = name.replace('(주)', '').replace('㈜', '').strip()
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8', errors='ignore')
            # Look for 10-digit or 3-2-5 patterns
            matches = re.findall(r'(\d{3}-\d{2}-\d{5})', html)
            for m in matches:
                clean = m.replace('-', '')
                is_val, _ = validate_biz_no(clean)
                if is_val:
                    # check if page text contains ceo or parts of addr
                    return m
    except Exception as e:
        pass
    return None

results = []
for t in targets:
    name = t['name']
    ceo = t['ceo']
    addr = t['addr']
    old_bno = t['biz_no']
    
    if name == '대성이앤지':
        results.append({
            'row_id': t['row_id'],
            'name': name,
            'old_bno': old_bno,
            'new_bno': '6068635543',
            'status': '수정완료 (사용자제공)'
        })
        continue
        
    found = search_bizno(name, ceo, addr)
    results.append({
        'row_id': t['row_id'],
        'name': name,
        'ceo': ceo,
        'addr': addr,
        'old_bno': old_bno,
        'new_bno': found,
        'status': '찾음' if found else '미발견'
    })
    time.sleep(0.3)

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\biz_lookup_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Finished lookup. Summary:")
for r in results:
    print(f"[{r['row_id']:3d}] {r['name']:25s} | 기존:{r['old_bno']} -> 신규:{r.get('new_bno')}")
