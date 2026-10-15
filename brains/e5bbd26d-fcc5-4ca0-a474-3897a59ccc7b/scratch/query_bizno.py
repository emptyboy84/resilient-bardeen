import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    return ' '.join(cleantext.split())

def search_bizno(query):
    print(f"=== SEARCH: {query} ===")
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            # Find all items like <div class="custom_item ..."> or table rows
            # Let's search for matches
            lines = [line.strip() for line in html.split('\n') if any(k in line for k in ['부산이야', '조진성', '산호', '진연로', '양정동', '302호'])]
            for l in lines[:20]:
                print("Line:", clean_html(l))
                
            # Also find company listings: <a href="/article/..."> or similar
            items = re.findall(r'<a href="(/article/[^"]+)"[^>]*>(.*?)</a>', html)
            for href, text in items[:15]:
                print("Article:", clean_html(text), "->", href)
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    search_bizno('부산이야')
    search_bizno('진연로9번길 19')
    search_bizno('조진성 부산')
