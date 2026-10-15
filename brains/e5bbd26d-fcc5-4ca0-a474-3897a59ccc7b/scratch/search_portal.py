import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def search_daum(q):
    url = f"https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&sug=&sugo=&sq=&o=&q={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            clean = re.sub(r'<[^>]+>', ' ', html)
            clean = ' '.join(clean.split())
            print(f"\n=== DAUM SEARCH: {q} ===")
            # find occurrences of keywords
            for m in re.finditer(r'(?:조진성|부산이야|2799-3270|산호빌딩)', clean):
                start = max(0, m.start() - 100)
                end = min(len(clean), m.end() + 100)
                print(f"...{clean[start:end]}...")
    except Exception as e:
        print("Daum error:", e)

search_daum('"부산이야" "조진성"')
search_daum('"부산이야" "산호빌딩"')
search_daum('"부산이야" "진연로"')
search_daum('"010-2799-3270"')
search_daum('"2799-3270"')
