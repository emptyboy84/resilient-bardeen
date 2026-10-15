import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def clean_html(raw_html):
    return ' '.join(re.sub(r'<[^>]+>', ' ', raw_html).split())

def search(query):
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    print(f"=== SEARCH: {query} ===")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            posts = re.findall(r'<div class="single-post.*?<hr>', html, re.DOTALL)
            print(f"Total posts found: {len(posts)}")
            for p in posts:
                cleaned = clean_html(p)
                print("POST:", cleaned)
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    search('조진성')
