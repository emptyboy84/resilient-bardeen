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

queries = ["삼성지투비", "화산", "원광전열", "비엔아이", "진영노즐"]

for q in queries:
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            articles = re.findall(r'/article/(\d{10})', html)
            print(f"=== {q} ===")
            for a in articles:
                is_val, _ = validate_biz_no(a)
                # fetch snippet
                pos = html.find(a)
                snippet = re.sub(r'<[^>]+>', ' ', html[max(0, pos-100):min(len(html), pos+200)])
                snippet = ' '.join(snippet.split())
                print(f"  {a} (Valid: {is_val}) -> {snippet[:120]}")
    except Exception as e:
        print(f"Error {q}: {e}")
