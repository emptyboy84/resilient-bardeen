import urllib.request
import urllib.parse
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

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

query = "비엔아이"
url = f"https://bizno.net/?query={urllib.parse.quote(query)}"

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=5) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

articles = re.findall(r'/article/(\d{10})', html)
print(f"Total articles found for {query}: {len(articles)}")

busan_matches = []
for a in set(articles):
    det_url = f"https://bizno.net/article/{a}"
    dreq = urllib.request.Request(det_url, headers=headers)
    try:
        with urllib.request.urlopen(dreq, timeout=3) as dresp:
            dhtml = dresp.read().decode('utf-8', errors='ignore')
            name_m = re.search(r'<title>(.*?)</title>', dhtml)
            title = name_m.group(1) if name_m else ''
            if '부산' in dhtml:
                is_val, _ = validate_biz_no(a)
                # extract ceo, addr
                busan_matches.append({
                    'biz_no': f"{a[:3]}-{a[3:5]}-{a[5:]}",
                    'title': title,
                    'valid': is_val,
                    'is_busan': True
                })
                print(f"Found Busan BNI: {a} -> {title}")
    except Exception as e:
        pass

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bni_busan_matches.json', 'w', encoding='utf-8') as f:
    json.dump(busan_matches, f, ensure_ascii=False, indent=2)
