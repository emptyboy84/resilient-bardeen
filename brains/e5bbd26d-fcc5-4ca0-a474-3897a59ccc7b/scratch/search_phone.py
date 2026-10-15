import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for q in ['010-2799-3270', '01027993270', '2799-3270 조진성', '부산이야 조진성', '조진성 부산진구']:
    url = f"https://search.naver.com/search.naver?where=view&sm=tab_jum&query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            clean = ' '.join(re.sub(r'<[^>]+>', ' ', html).split())
            print(f"\n=== NAVER VIEW: {q} ===")
            if '검색결과가 없습니다' in clean:
                print("No results.")
            else:
                # search for matches
                matches = re.findall(r'.{0,50}(?:2799|3270|조진성|부산이야).{0,50}', clean)
                for m in matches[:5]:
                    print("  ->", m.strip())
    except Exception as e:
        print(f"Error {q}:", e)
