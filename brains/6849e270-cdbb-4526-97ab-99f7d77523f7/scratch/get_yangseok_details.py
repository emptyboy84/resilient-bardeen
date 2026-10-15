import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

url = "https://bizno.net/article/6052724221"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=3) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# strip tags and print key lines
clean = re.sub(r'<[^>]+>', '\n', html)
for line in clean.split('\n'):
    l = line.strip()
    if l and any(k in l for k in ['상호', '대표자', '주소', '우편', '업종', '상태', '등록', '전화']):
        print(l)
