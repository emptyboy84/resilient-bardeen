import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
url = 'https://bizno.net/article/6158170796'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# print all table rows and text
for tr in re.findall(r'<table.*?>.*?</table>', html, re.DOTALL):
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', tr, re.DOTALL)
    for r in rows:
        cells = [re.sub(r'<[^>]+>', '', c).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.DOTALL)]
        if any(cells):
            print(" | ".join(cells))
