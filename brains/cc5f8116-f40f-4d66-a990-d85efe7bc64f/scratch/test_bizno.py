import urllib.request
import urllib.parse
import re

def test_bizno_search(query):
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            print(f"Status: {resp.status}, HTML length: {len(html)}")
            # Look for article links
            links = re.findall(r'href=["\'](/article/\d+)["\']', html)
            print(f"Article links found for '{query}': {links[:5]}")
            # Look for titles/names
            return html, links
    except Exception as e:
        print(f"Error for '{query}': {e}")
        return None, []

test_bizno_search("모두싸인")
test_bizno_search("유비플러스")
test_bizno_search("아이티에프씨")
