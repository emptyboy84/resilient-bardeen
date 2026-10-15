import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def clean_html(raw_html):
    return ' '.join(re.sub(r'<[^>]+>', ' ', raw_html).split())

def search_bizno(query):
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    print(f"=== SEARCH: {query} ===")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            posts = re.findall(r'<div class="single-post.*?<hr>', html, re.DOTALL)
            print(f"Total posts: {len(posts)}")
            for p in posts:
                print("POST:", clean_html(p))
    except Exception as e:
        print("Error:", e)

search_bizno('오희섭')
search_bizno('THE5')
search_bizno('517-8828')
