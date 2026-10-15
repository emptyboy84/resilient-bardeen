import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def clean_html(raw_html):
    return ' '.join(re.sub(r'<[^>]+>', ' ', raw_html).split())

def search_exact(q):
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
    posts = re.findall(r'<div class="single-post.*?<hr>', html, re.DOTALL)
    print(f"\nSearch [{q}]: {len(posts)} posts")
    for p in posts:
        txt = clean_html(p)
        # only show if title matches or contains 부산이야 or 조진성
        if any(k in txt for k in ['부산이야', '조진성', '진연로']):
            print("MATCH:", txt)

search_exact('부산이야')
search_exact('이야')
search_exact('부산이야기')
