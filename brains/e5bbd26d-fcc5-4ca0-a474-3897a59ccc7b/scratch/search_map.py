import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def search_daum_map(q):
    url = f"https://search.daum.net/search?w=tot&DA=YZR&q={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            clean = ' '.join(re.sub(r'<[^>]+>', ' ', html).split())
            print(f"=== DAUM: {q} ===")
            if '결과가 없습니다' in clean or '검색결과가 없습니다' in clean:
                print('No results')
            else:
                for m in re.finditer(r'(?:8828|THE 5|THE5|오희섭|음악학원|스튜디오)', clean):
                    s = max(0, m.start() - 50)
                    e = min(len(clean), m.end() + 50)
                    print(f"  ...{clean[s:e]}...")
    except Exception as e:
        print("Error:", e)

search_daum_map('051-517-8828')
search_daum_map('THE 5 MUSIC SHEET')
search_daum_map('동요문화예술협회')
