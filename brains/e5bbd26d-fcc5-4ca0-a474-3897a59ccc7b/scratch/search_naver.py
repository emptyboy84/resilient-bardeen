import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def search_naver(q):
    url = f"https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            clean = re.sub(r'<[^>]+>', ' ', html)
            clean = ' '.join(clean.split())
            print(f"\n=== NAVER SEARCH: {q} ===")
            if '검색결과가 없습니다' in clean:
                print('No results found.')
            else:
                # print any occurrences
                for m in re.finditer(r'(?:조진성|부산이야|2799|3270|산호빌딩)', clean):
                    s = max(0, m.start() - 80)
                    e = min(len(clean), m.end() + 80)
                    print(f"...{clean[s:e]}...")
    except Exception as e:
        print("Naver error:", e)

search_naver('"부산이야" "조진성"')
search_naver('"부산이야" "산호빌딩"')
search_naver('"부산이야" "진연로"')
search_naver('조진성 "010-2799-3270"')
search_naver('"010-2799-3270"')
