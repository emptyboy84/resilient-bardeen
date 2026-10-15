import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
url = 'https://bizno.net/article/6158170796'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

for tr in re.findall(r'<tr[^>]*>.*?</tr>', html, re.DOTALL):
    txt = re.sub(r'<[^>]+>', ' ', tr)
    txt = ' '.join(txt.split())
    if any(k in txt for k in ['회사명', '대표자', '사업자', '주소', '업종', '상태', '개업', '설립', '전화', '팩스', '폐업']):
        print(txt)
