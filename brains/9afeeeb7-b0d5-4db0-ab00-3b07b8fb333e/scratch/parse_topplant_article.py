import urllib.request
import gzip
import re

url = "https://bizno.net/article/8998100224"
req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Encoding": "gzip, deflate"
    }
)

try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read()
        if resp.info().get('Content-Encoding') == 'gzip':
            raw = gzip.decompress(raw)
        
        html = raw.decode('utf-8', errors='replace')
        
        # extract table rows
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        for r in rows:
            clean = re.sub(r'<[^>]+>', ' ', r).strip()
            clean = re.sub(r'\s+', ' ', clean)
            if clean:
                print("Table Row:", clean)
                
        # also print 국세청 상태
        for line in html.splitlines():
            if any(k in line for k in ["상태", "국세청", "과세", "폐업", "계속", "전화번호", "우편", "설립", "법인"]):
                clean = re.sub(r'<[^>]+>', ' ', line).strip()
                if len(clean) > 0 and len(clean) < 200:
                    print("Line:", clean)
except Exception as e:
    import traceback
    traceback.print_exc()
