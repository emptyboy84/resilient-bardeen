import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def clean_html(raw_html):
    return ' '.join(re.sub(r'<[^>]+>', ' ', raw_html).split())

def search_addr(q):
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
    posts = re.findall(r'<div class="single-post.*?<hr>', html, re.DOTALL)
    print(f"\nSearch [{q}]: {len(posts)} posts")
    for p in posts:
        txt = clean_html(p)
        print("ADDR POST:", txt)

search_addr('양정동 234-8')
search_addr('진연로9번길')
