import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for q in ['051-517-8828', '517-8828', '"517-8828"', '"051-517-8828"', '오희섭 금정구']:
    url = f"https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            clean = ' '.join(re.sub(r'<[^>]+>', ' ', html).split())
            print(f"\n=== NAVER SEARCH: {q} ===")
            if '검색결과가 없습니다' in clean:
                print('No results.')
            else:
                for m in re.finditer(r'(?:8828|오희섭|SHEET|음악|금정구)', clean):
                    s = max(0, m.start() - 60)
                    e = min(len(clean), m.end() + 60)
                    print(f"  ...{clean[s:e]}...")
    except Exception as e:
        print("Error:", e)
